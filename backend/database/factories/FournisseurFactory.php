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
    [
        'nom' => 'PharmaPlus Distribution',
        'contact' => 'Youssef El Fassi',
        'telephone' => '0522334455',
        'email' => 'contact@pharmaplus.ma',
        'adresse' => 'Zone Industrielle Aïn Sebaâ, Casablanca',
        'specialite' => 'Médicaments généralistes'
    ],

    [
        'nom' => 'Atlas Médical',
        'contact' => 'Salma Bennani',
        'telephone' => '0537278910',
        'email' => 'commercial@atlasmedical.ma',
        'adresse' => 'Avenue Mohammed VI, Rabat',
        'specialite' => 'Antibiotiques'
    ],

    [
        'nom' => 'MediSanté Maroc',
        'contact' => 'Karim Amrani',
        'telephone' => '0524442211',
        'email' => 'commande@medisante.ma',
        'adresse' => 'Boulevard Abdelkrim El Khattabi, Marrakech',
        'specialite' => 'Produits hospitaliers'
    ],

    [
        'nom' => 'Saha Pharma',
        'contact' => 'Nadia El Alaoui',
        'telephone' => '0539945678',
        'email' => 'info@sahapharma.ma',
        'adresse' => 'Quartier Agdal, Rabat',
        'specialite' => 'Parapharmacie'
    ],

    [
        'nom' => 'Nordic Pharma Maroc',
        'contact' => 'Hamza Benkirane',
        'telephone' => '0535401122',
        'email' => 'support@nordicpharma.ma',
        'adresse' => 'Route de Tétouan, Tanger',
        'specialite' => 'Pédiatrie'
    ],

    [
        'nom' => 'BioCare Distribution',
        'contact' => 'Fatima Zahra Lahlou',
        'telephone' => '0522887766',
        'email' => 'contact@biocare.ma',
        'adresse' => 'Bd Hassan II, Casablanca',
        'specialite' => 'Cardiologie'
    ],

    [
        'nom' => 'Pharma Sud',
        'contact' => 'Rachid El Idrissi',
        'telephone' => '0528823344',
        'email' => 'vente@pharmasud.ma',
        'adresse' => 'Avenue Hassan Ier, Agadir',
        'specialite' => 'Dermatologie'
    ],

    [
        'nom' => 'MedLink Santé',
        'contact' => 'Imane Cherkaoui',
        'telephone' => '0535689988',
        'email' => 'contact@medlink.ma',
        'adresse' => 'Centre Ville, Meknès',
        'specialite' => 'Diabétologie'
    ],
];



return $fournisseurs[array_rand($fournisseurs)];

    }
}
