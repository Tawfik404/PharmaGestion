<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Ordonnance;

class Client extends Model
{
    /** @use HasFactory<\Database\Factories\ClientFactory> */
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'date_naissance' => 'date',
        'is_discounted' => 'boolean',
        'discount_rate' => 'decimal:2',
    ];

    public function ordonnances()
    {
        return $this->hasMany(Ordonnance::class);
    }

    public function ventes()
    {
        return $this->hasMany(Vente::class);
    }
}
