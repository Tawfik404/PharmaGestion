<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Ordonnance;

class Medicament extends Model
{
    /** @use HasFactory<\Database\Factories\MedicamentFactory> */
    use HasFactory;
        public function ordonnances(){
        return $this->hasOne(Ordonnance::class);
    }
}
