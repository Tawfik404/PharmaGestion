<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockMovement extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'unit_cost' => 'decimal:2',
    ];

    public function medicament()
    {
        return $this->belongsTo(Medicament::class);
    }
}
