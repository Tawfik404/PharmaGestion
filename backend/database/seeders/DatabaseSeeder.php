<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            AdminSeeder::class,
            MedecinSeeder::class,
            FournisseurSeeder::class,
            ClientSeeder::class,
            MedicamentSeeder::class,
            OrdonnanceSeeder::class,
            VenteSeeder::class,
            PurchaseOrderSeeder::class,
            StockMovementSeeder::class,
        ]);
    }
}
