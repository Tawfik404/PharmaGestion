<?php

namespace App\Http\Controllers;

use App\Models\Medecin;
use App\Http\Requests\StoreMedecinRequest;
use App\Http\Requests\UpdateMedecinRequest;
use Illuminate\Http\Request;

class MedecinController
{
    public function index(Request $request)
    {
        $requete = Medecin::query();

        if ($request->filled('search')) {
            $terme = '%'.$request->search.'%';
            $requete->where(function ($q) use ($terme) {
                $q->where('nom', 'like', $terme)->orWhere('prenom', 'like', $terme);
            });
        }

        return response()->json($requete->orderBy('nom')->orderBy('prenom')->get());
    }

    public function create()
    {
        //
    }

    public function store(StoreMedecinRequest $request)
    {
        $medecin = Medecin::create($request->validated());

        return response()->json([
            'message' => 'Medecin ajoute avec succes',
            'donnees' => $medecin,
        ], 201);
    }

    public function show(Medecin $medecin)
    {
        return response()->json([
            'donnees' => $medecin,
        ]);
    }

    public function edit(Medecin $medecin)
    {
        //
    }

    public function update(UpdateMedecinRequest $request, Medecin $medecin)
    {
        $medecin->update($request->validated());

        return response()->json([
            'message' => 'Medecin mis a jour avec succes',
            'donnees' => $medecin,
        ]);
    }

    public function destroy(Medecin $medecin)
    {
        $medecin->delete();

        return response()->json([
            'message' => 'Medecin supprime avec succes',
        ]);
    }
}
