<?php

namespace Database\Factories;

use App\Models\Medicament;
use App\Models\PurchaseOrderItem;
use Illuminate\Database\Eloquent\Factories\Factory;

class PurchaseOrderItemFactory extends Factory
{
    protected $model = PurchaseOrderItem::class;

    public function definition(): array
    {
        $medicament = Medicament::inRandomOrder()->first() ?? Medicament::factory()->create();
        $quantity = fake()->numberBetween(10, 200);
        $unitPrice = (float) $medicament->prix_achat * fake()->randomFloat(2, 0.8, 1.1);

        return [
            'medicament_id' => $medicament->id,
            'quantity' => $quantity,
            'unit_price' => round($unitPrice, 2),
            'line_total' => round($unitPrice * $quantity, 2),
        ];
    }
}
