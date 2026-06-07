<?php

namespace Database\Factories;

use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClientFactory extends Factory
{
    protected $model = Client::class;

    private static array $firstNames = [
        'Ahmed', 'Mohamed', 'Mahmoud', 'Omar', 'Youssef', 'Khaled', 'Mustafa', 'Amine', 'Karim', 'Tariq',
        'Hassan', 'Hussein', 'Ali', 'Ibrahim', 'Ismail', 'Abdallah', 'Abdelrahman', 'Abdelaziz', 'Samir', 'Nabil',
        'Fouad', 'Hamza', 'Anas', 'Bilal', 'Walid', 'Rachid', 'Said', 'Aymane', 'Zakaria', 'Ayoub',
        'Reda', 'Othmane', 'Soufiane', 'Mehdi', 'Mounir', 'Jamal', 'Fares', 'Marwan', 'Badr', 'Hicham',
        'Yassine', 'Adil', 'Imad', 'Noureddine', 'Taha', 'Fatima', 'Aisha', 'Mariam', 'Nour', 'Salma',
        'Khadija', 'Asma', 'Sara', 'Yasmine', 'Imane', 'Ikram', 'Rania', 'Nadia', 'Samira', 'Laila',
        'Hajar', 'Sanaa', 'Souad', 'Amal', 'Malak', 'Chaimae', 'Kenza', 'Nawal', 'Hind', 'Dounia',
        'Rim', 'Farah', 'Nisrine', 'Zineb', 'Aya', 'Lina', 'Maha', 'Sabrina', 'Racha', 'Wafa',
        'Noura', 'Meryem', 'Ilham', 'Hanane', 'Ghita',
    ];

    private static array $lastNames = [
        'Benali', 'Alami', 'El Amrani', 'Bensalem', 'Al Farsi', 'Haddad', 'Khatib', 'Nasser', 'Mansouri', 'Rahmani',
        'Bennani', 'Alaoui', 'Cherkaoui', 'Tazi', 'Fassi', 'Berrada', 'El Idrissi', 'Amrani', 'Benjelloun', 'Lahlou',
        'Ouali', 'Talbi', 'Chakir', 'Boukhriss', 'Ait Ahmed', 'Ait Ali', 'Ait Lahcen', 'Ait Said', 'Bouzidi', 'Bouziane',
        'Mekouar', 'Belkacem', 'Belhaj', 'Mouline', 'Toumi', 'Hariri', 'Benkirane', 'Azzouzi', 'Ouazzani', 'El Khattabi',
        'Zerouali', 'Abdellaoui', 'Brahimi', 'Moujahid', 'Hamdani', 'Skalli', 'Kadiri', 'Yazidi', 'Benomar', 'Chraibi',
    ];

    public function definition(): array
    {
        $hasDiscount = fake()->boolean(30);

        return [
            'nom' => fake()->randomElement(self::$lastNames),
            'prenom' => fake()->randomElement(self::$firstNames),
            'date_naissance' => fake()->dateTimeBetween('-80 years', '-18 years')->format('Y-m-d'),
            'telephone' => '0' . fake()->randomElement(['5', '6', '7']) . fake()->numerify('########'),
            'email' => fake()->unique()->safeEmail(),
            'adresse' => fake()->streetAddress() . ', ' . fake()->city(),
            'is_discounted' => $hasDiscount,
            'discount_rate' => $hasDiscount ? fake()->randomElement([5, 10, 15, 20]) : 0,
        ];
    }
}
