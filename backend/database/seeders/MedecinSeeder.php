<?php

namespace Database\Seeders;

use App\Models\Medecin;
use Illuminate\Database\Seeder;

class MedecinSeeder extends Seeder
{
    public function run(): void
    {
        Medecin::factory(8)->create();
    }
}
