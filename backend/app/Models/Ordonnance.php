<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Client;
use App\Models\Medicament;

class Ordonnance extends Model
{
    /** @use HasFactory<\Database\Factories\OrdonnanceFactory> */
    use HasFactory;
        public function client(){
            return $this->belongsTo(Client::class);
        }
        public function medicament(){
            return $this->belongsTo(Medicament::class);
        }
}
