<?php

namespace Database\Factories;

use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClientFactory extends Factory
{
    protected $model = Client::class;

    public function definition(): array
    {
        $hasDiscount = fake()->boolean(30);

        return [
            'nom' => fake()->lastName(),
            'prenom' => fake()->firstName(),
            'date_naissance' => fake()->dateTimeBetween('-80 years', '-18 years')->format('Y-m-d'),
            'telephone' => '0' . fake()->randomElement(['5', '6', '7']) . fake()->numerify('########'),
            'email' => fake()->unique()->safeEmail(),
            'adresse' => fake()->streetAddress() . ', ' . fake()->city(),
            'is_discounted' => $hasDiscount,
            'discount_rate' => $hasDiscount ? fake()->randomElement([5, 10, 15, 20]) : 0,
        ];
    }
}
