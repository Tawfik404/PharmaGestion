<?php

namespace Database\Factories;

use App\Models\Medicament;
use App\Models\VenteItem;
use Illuminate\Database\Eloquent\Factories\Factory;

class VenteItemFactory extends Factory
{
    protected $model = VenteItem::class;

    public function definition(): array
    {
        $medicament = Medicament::inRandomOrder()->first() ?? Medicament::factory()->create();
        $quantity = fake()->numberBetween(1, 5);
        $prixVente = (float) $medicament->prix_vente;

        return [
            'medicament_id' => $medicament->id,
            'quantity' => $quantity,
            'unit_purchase_price' => (float) $medicament->prix_achat,
            'unit_sale_price' => $prixVente,
            'line_total' => round($prixVente * $quantity, 2),
        ];
    }
}
