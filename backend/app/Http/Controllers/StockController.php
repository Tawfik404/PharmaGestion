<?php

namespace App\Http\Controllers;

use App\Exports\StockExport;
use App\Models\StockMovement;
use Illuminate\Http\Request;

class StockController
{
    public function index(Request $request)
    {
        $requete = StockMovement::with('medicament')->latest();

        if ($request->filled('type')) {
            $requete->where('type', $request->type);
        }

        if ($request->filled('medicament_id')) {
            $requete->where('medicament_id', $request->medicament_id);
        }

        return response()->json(['donnees' => $requete->get()]);
    }

    public function export()
    {
        return (new StockExport)->download();
    }
}
