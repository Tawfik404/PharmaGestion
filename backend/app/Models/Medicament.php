<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Ordonnance;

class Medicament extends Model
{
    /** @use HasFactory<\Database\Factories\MedicamentFactory> */
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'prix_achat' => 'decimal:2',
        'prix_vente' => 'decimal:2',
        'taux_prise_en_charge' => 'decimal:2',
        'date_expiration' => 'date',
    ];

    public function ordonnances()
    {
        return $this->hasMany(Ordonnance::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    public function venteItems()
    {
        return $this->hasMany(VenteItem::class);
    }
}
