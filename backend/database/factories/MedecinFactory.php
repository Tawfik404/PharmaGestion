<?php

namespace Database\Factories;

use App\Models\Medecin;
use Illuminate\Database\Eloquent\Factories\Factory;

class MedecinFactory extends Factory
{
    protected $model = Medecin::class;

    private static array $medecins = [
        ['nom' => 'Mekhaled', 'prenom' => 'Redouane'],
        ['nom' => 'Bensalem', 'prenom' => 'Nadia'],
        ['nom' => 'Hamidi', 'prenom' => 'Sofiane'],
        ['nom' => 'Amrani', 'prenom' => 'Leila'],
        ['nom' => 'Khelifi', 'prenom' => 'Abdelkader'],
        ['nom' => 'Zaidi', 'prenom' => 'Karima'],
        ['nom' => 'Bencheikh', 'prenom' => 'Hicham'],
        ['nom' => 'Merabet', 'prenom' => 'Samira'],
    ];

    public function definition(): array
    {
        $medecin = fake()->unique()->randomElement(self::$medecins);

        return [
            'nom' => $medecin['nom'],
            'prenom' => $medecin['prenom'],
        ];
    }
}
