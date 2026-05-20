<?php

namespace Database\Seeders;

use App\Models\Medicament;
use Illuminate\Database\Seeder;

class MedicamentSeeder extends Seeder
{
    public function run(): void
    {
        Medicament::factory(27)->create();

        Medicament::factory()->lowStock()->count(3)->create();

        Medicament::factory()->expired()->count(2)->create();
    }
}
