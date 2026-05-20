<?php

namespace Database\Seeders;

use App\Models\Medicament;
use App\Models\StockMovement;
use App\Models\Vente;
use App\Models\VenteItem;
use Illuminate\Database\Seeder;

class VenteSeeder extends Seeder
{
    public function run(): void
    {
        Vente::factory(30)->create()->each(function (Vente $vente) {
            $nombreItems = fake()->numberBetween(1, 5);
            $medicaments = Medicament::inRandomOrder()->limit($nombreItems)->get();
            $sousTotal = 0;
            $itemsData = [];

            foreach ($medicaments as $medicament) {
                $quantite = fake()->numberBetween(1, 4);
                $prixVente = (float) $medicament->prix_vente;
                $totalLigne = round($prixVente * $quantite, 2);
                $sousTotal += $totalLigne;

                $stockAvant = (int) $medicament->qte_dispo;
                $stockApres = max(0, $stockAvant - $quantite);

                $medicament->update(['qte_dispo' => $stockApres]);

                $itemsData[] = [
                    'medicament_id' => $medicament->id,
                    'medicament' => $medicament,
                    'quantity' => $quantite,
                    'stock_avant' => $stockAvant,
                    'stock_apres' => $stockApres,
                    'line_total' => $totalLigne,
                ];

                StockMovement::create([
                    'medicament_id' => $medicament->id,
                    'admin_id' => $vente->admin_id,
                    'type' => 'vente',
                    'quantity' => -$quantite,
                    'stock_before' => $stockAvant,
                    'stock_after' => $stockApres,
                    'notes' => 'Vente #' . $vente->id,
                ]);
            }

            $tauxRemise = (float) $vente->discount_rate;
            $montantRemise = round($sousTotal * $tauxRemise / 100, 2);
            $total = round($sousTotal - $montantRemise, 2);

            $vente->update([
                'subtotal' => $sousTotal,
                'discount_amount' => $montantRemise,
                'total' => $total,
            ]);

            foreach ($itemsData as $item) {
                $vente->items()->create([
                    'medicament_id' => $item['medicament']->id,
                    'quantity' => $item['quantity'],
                    'unit_purchase_price' => (float) $item['medicament']->prix_achat,
                    'unit_sale_price' => (float) $item['medicament']->prix_vente,
                    'line_total' => $item['line_total'],
                ]);
            }
        });
    }
}
