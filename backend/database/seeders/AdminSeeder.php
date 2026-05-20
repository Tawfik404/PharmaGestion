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
       Admin::create([
        'nom'=>'abouhmad',
        'prenom'=>'tawfik0',
        'email'=>'tawfik@gmail.com',
        'password'=>Hash::make("tawfik"),
        'telephone'=>"06123456789",
        'role'=>"pharmacien",
       ]);

        Admin::create([
        'nom'=>'abouhmad',
        'prenom'=>'tawfik1',
        'email'=>'tawfik1@gmail.com',
        'password'=>Hash::make("tawfik1"),
        'telephone'=>"06123456789",
        'role'=>"caissier",
       ]);


        Admin::create([
        'nom'=>'abouhmad',
        'prenom'=>'tawfik2',
        'email'=>'tawfik2@gmail.com',
        'password'=>Hash::make("tawfik2"),
        'telephone'=>"06123456789",
        'role'=>"gestionnaire",
       ]);
    }
}
