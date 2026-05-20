<?php

namespace Database\Factories;

use App\Models\Fournisseur;
use Illuminate\Database\Eloquent\Factories\Factory;

class FournisseurFactory extends Factory
{
    protected $model = Fournisseur::class;

    public function definition(): array
    {
        $fournisseurs = [
            ['nom' => 'SARPHARM Distribution', 'contact' => 'Rabah Mansouri', 'telephone' => '021634567', 'email' => 'contact@sarpharm.dz', 'adresse' => 'Zone Industrielle Oued Smar, Alger', 'specialite' => 'Généraliste'],
            ['nom' => 'PHARMA-ALGERIE', 'contact' => 'Saliha Boumediene', 'telephone' => '031890123', 'email' => 'info@pharma-alg.dz', 'adresse' => 'Rue des Frères Abbas, Blida', 'specialite' => 'Antibiotiques'],
            ['nom' => 'MEDIPHARMA', 'contact' => 'Karim Allouache', 'telephone' => '041234567', 'email' => 'cmd@medipharma.dz', 'adresse' => 'Cité 1000 logements, Oran', 'specialite' => 'Spécialités'],
            ['nom' => 'ALGER PHARMA', 'contact' => 'Nesrine Hamidouche', 'telephone' => '021567890', 'email' => 'vente@algerpharma.dz', 'adresse' => 'Bab Ezzouar, Alger', 'specialite' => 'Généraliste'],
            ['nom' => 'BIOMEDICAL SPA', 'contact' => 'Amine Belkacem', 'telephone' => '025678901', 'email' => 'contact@biomedical.dz', 'adresse' => 'Route de l\'Université, Tizi Ouzou', 'specialite' => 'Pédiatrie'],
            ['nom' => 'PHARMADZ', 'contact' => 'Fatima Zohra', 'telephone' => '038765432', 'email' => 'info@pharmadz.dz', 'adresse' => 'Avenue Colonel Lotfi, Constantine', 'specialite' => 'Cardiologie'],
        ];

        $index = $this->faker->unique()->numberBetween(0, count($fournisseurs) - 1);

        return $fournisseurs[$index];
    }
}
