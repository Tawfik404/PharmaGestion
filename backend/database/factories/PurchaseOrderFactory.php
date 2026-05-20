<?php

namespace Database\Factories;

use App\Models\Admin;
use App\Models\Fournisseur;
use App\Models\PurchaseOrder;
use Illuminate\Database\Eloquent\Factories\Factory;

class PurchaseOrderFactory extends Factory
{
    protected $model = PurchaseOrder::class;

    public function definition(): array
    {
        $status = fake()->randomElement(['reçue', 'reçue', 'commandée', 'commandée', 'brouillon', 'annulée']);

        return [
            'fournisseur_id' => Fournisseur::inRandomOrder()->first()?->id ?? Fournisseur::factory(),
            'admin_id' => Admin::inRandomOrder()->first()?->id ?? 1,
            'status' => $status,
            'ordered_at' => fake()->dateTimeBetween('-60 days', 'now')->format('Y-m-d'),
            'received_at' => $status === 'reçue'
                ? fake()->dateTimeBetween('-30 days', 'now')->format('Y-m-d')
                : null,
            'total_amount' => 0,
            'notes' => fake()->optional(0.4)->sentence(8),
        ];
    }
}
