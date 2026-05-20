<?php

namespace Database\Seeders;

use App\Models\Medicament;
use App\Models\PurchaseOrder;
use App\Models\StockMovement;
use Illuminate\Database\Seeder;

class PurchaseOrderSeeder extends Seeder
{
    public function run(): void
    {
        PurchaseOrder::factory(10)->create()->each(function (PurchaseOrder $commande) {
            $nombreItems = fake()->numberBetween(2, 5);
            $medicaments = Medicament::inRandomOrder()->limit($nombreItems)->get();
            $total = 0;

            foreach ($medicaments as $medicament) {
                $quantite = fake()->numberBetween(20, 200);
                $prixUnitaire = round((float) $medicament->prix_achat * fake()->randomFloat(2, 0.85, 1.15), 2);
                $totalLigne = round($prixUnitaire * $quantite, 2);
                $total += $totalLigne;

                $commande->items()->create([
                    'medicament_id' => $medicament->id,
                    'quantity' => $quantite,
                    'unit_price' => $prixUnitaire,
                    'line_total' => $totalLigne,
                ]);

                if ($commande->status === 'reçue') {
                    $stockAvant = (int) $medicament->qte_dispo;
                    $stockApres = $stockAvant + $quantite;

                    $medicament->update(['qte_dispo' => $stockApres]);

                    StockMovement::create([
                        'medicament_id' => $medicament->id,
                        'admin_id' => $commande->admin_id,
                        'type' => 'entree',
                        'quantity' => $quantite,
                        'stock_before' => $stockAvant,
                        'stock_after' => $stockApres,
                        'unit_cost' => $prixUnitaire,
                        'notes' => 'Commande #' . $commande->id . ' - ' . $commande->fournisseur->nom,
                    ]);
                }
            }

            $commande->update(['total_amount' => round($total, 2)]);
        });
    }
}
