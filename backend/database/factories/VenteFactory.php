<?php

namespace Database\Factories;

use App\Models\Admin;
use App\Models\Client;
use App\Models\Vente;
use Illuminate\Database\Eloquent\Factories\Factory;

class VenteFactory extends Factory
{
    protected $model = Vente::class;

    public function definition(): array
    {
        $hasClient = fake()->boolean(70);
        $client = $hasClient ? Client::inRandomOrder()->first() ?? Client::factory()->create() : null;

        return [
            'client_id' => $client?->id,
            'admin_id' => Admin::inRandomOrder()->first()?->id ?? 1,
            'customer_name' => $hasClient ? null : fake()->firstName() . ' ' . fake()->lastName(),
            'subtotal' => 0,
            'discount_rate' => $hasClient && $client?->is_discounted ? (float) $client->discount_rate : fake()->randomFloat(2, 0, 15),
            'discount_amount' => 0,
            'total' => 0,
            'payment_method' => fake()->randomElement(['especes', 'especes', 'especes', 'carte', 'cheque', 'assurance']),
            'sold_at' => fake()->dateTimeBetween('-45 days', 'now'),
        ];
    }
}
