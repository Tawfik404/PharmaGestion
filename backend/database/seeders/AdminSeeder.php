<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

#test accounts:
               Admin::create([
        'nom'=>'tawfik',
        'prenom'=>'pharmacien',
        'email'=>'pharmacien@gmail.com',
        'password'=>Hash::make("pharmacien"),
        'telephone'=>"06123456789",
        'role'=>"pharmacien",
       ]);
        Admin::create([
        'nom'=>'Ehsan',
        'prenom'=>'caissier',
        'email'=>'caissier@gmail.com',
        'password'=>Hash::make("caissier"),
        'telephone'=>"06123456789",
        'role'=>"caissier",
       ]);
       
        Admin::create([
        'nom'=>'tawfik',
        'prenom'=>'gestionnaire',
        'email'=>'gestionnaire@gmail.com',
        'password'=>Hash::make("gestionnaire"),
        'telephone'=>"06123456789",
        'role'=>"gestionnaire",
       ]);
    }
}
