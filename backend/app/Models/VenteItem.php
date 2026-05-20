<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VenteItem extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'unit_purchase_price' => 'decimal:2',
        'unit_sale_price' => 'decimal:2',
        'line_total' => 'decimal:2',
    ];

    public function vente()
    {
        return $this->belongsTo(Vente::class);
    }

    public function medicament()
    {
        return $this->belongsTo(Medicament::class);
    }
}
