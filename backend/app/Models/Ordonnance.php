<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Client;
use App\Models\Medecin;
use App\Models\Medicament;

class Ordonnance extends Model
{
    /** @use HasFactory<\Database\Factories\OrdonnanceFactory> */
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'date_ordonnance' => 'date',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function medecin()
    {
        return $this->belongsTo(Medecin::class);
    }

    public function medicaments()
    {
        return $this->belongsToMany(Medicament::class, 'ordonnance_items')
            ->withPivot('dosage_medicament', 'instructions_posologie')
            ->withTimestamps();
    }
}
