<?php

namespace Database\Factories;

use App\Models\Admin;
use App\Models\Medicament;
use App\Models\StockMovement;
use Illuminate\Database\Eloquent\Factories\Factory;

class StockMovementFactory extends Factory
{
    protected $model = StockMovement::class;

    public function definition(): array
    {
        $medicament = Medicament::inRandomOrder()->first() ?? Medicament::factory()->create();
        $type = fake()->randomElement(['entree', 'entree', 'entree', 'sortie', 'ajustement', 'retour']);
        $quantity = $type === 'entree'
            ? fake()->numberBetween(10, 300)
            : fake()->numberBetween(1, 50);
        $stockBefore = fake()->numberBetween(0, 200);
        $stockAfter = $type === 'entree' || $type === 'retour'
            ? $stockBefore + $quantity
            : max(0, $stockBefore - $quantity);

        return [
            'medicament_id' => $medicament->id,
            'admin_id' => Admin::inRandomOrder()->first()?->id ?? 1,
            'type' => $type,
            'quantity' => $quantity,
            'stock_before' => $stockBefore,
            'stock_after' => $stockAfter,
            'unit_cost' => $type === 'entree' ? (float) $medicament->prix_achat : null,
            'notes' => match ($type) {
                'entree' => 'Réapprovisionnement fournisseur',
                'sortie' => 'Ajustement manuel',
                'ajustement' => 'Inventaire: correction de stock',
                'retour' => 'Retour fournisseur',
                default => null,
            },
        ];
    }

    public function entree(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'entree',
            'quantity' => fake()->numberBetween(10, 300),
        ]);
    }

    public function vente(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'vente',
            'quantity' => -fake()->numberBetween(1, 10),
        ]);
    }
}
