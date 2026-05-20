<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Medecin;
use App\Models\Ordonnance;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrdonnanceFactory extends Factory
{
    protected $model = Ordonnance::class;

    private static int $counter = 0;

    public function definition(): array
    {
        self::$counter++;

        return [
            'numero' => 'ORD-2026-' . str_pad((string) self::$counter, 3, '0', STR_PAD_LEFT),
            'client_id' => Client::inRandomOrder()->first()?->id ?? Client::factory(),
            'medecin_id' => Medecin::inRandomOrder()->first()?->id ?? Medecin::factory(),
            'date_ordonnance' => fake()->dateTimeBetween('-3 months', 'now')->format('Y-m-d'),
            'statut' => fake()->randomElement(['En attente', 'Traitée', 'En attente', 'Traitée', 'Traitée', 'Annulée']),
            'scan_path' => null,
            'notes' => fake()->optional(0.3)->sentence(6),
        ];
    }
}
