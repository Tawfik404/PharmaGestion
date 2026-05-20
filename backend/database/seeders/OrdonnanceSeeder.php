<?php

namespace Database\Seeders;

use App\Models\Medicament;
use App\Models\Ordonnance;
use Illuminate\Database\Seeder;

class OrdonnanceSeeder extends Seeder
{
    public function run(): void
    {
        Ordonnance::factory(15)->create()->each(function (Ordonnance $ordonnance) {
            $nombreMedicaments = fake()->numberBetween(1, 4);
            $medicaments = Medicament::inRandomOrder()->limit($nombreMedicaments)->get();

            foreach ($medicaments as $medicament) {
                $ordonnance->medicaments()->attach($medicament->id, [
                    'dosage_medicament' => fake()->randomElement([
                        '1 comprimé par jour',
                        '2 comprimés par jour',
                        '1 comprimé 3 fois par jour',
                        '1 sachet 2 fois par jour',
                        '1 ampoule par semaine',
                        '1 inhalation 2 fois par jour',
                        '1 comprimé le soir',
                        '1 cuillère à soupe 3 fois par jour',
                    ]),
                    'instructions_posologie' => fake()->randomElement([
                        'À prendre pendant le repas',
                        'À jeun 30 minutes avant le repas',
                        'Au coucher',
                        'En cas de douleur, sans dépasser 3 par jour',
                        'En inhalation matin et soir',
                    ]),
                ]);
            }
        });
    }
}
