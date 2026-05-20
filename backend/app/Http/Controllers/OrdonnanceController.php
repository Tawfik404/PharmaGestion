<?php

namespace App\Http\Controllers;

use App\Models\Ordonnance;
use App\Http\Requests\StoreOrdonnanceRequest;
use App\Http\Requests\UpdateOrdonnanceRequest;
use Illuminate\Support\Facades\Storage;

class OrdonnanceController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Ordonnance::all());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrdonnanceRequest $request)
    {
        $donnees = $request->validated();

        if ($request->hasFile('scan')) {
            $donnees['scan_path'] = Storage::url($request->file('scan')->store('ordonnances', 'public'));
            unset($donnees['scan']);
        }

        $ordonnance = Ordonnance::create($donnees);

        return response()->json([
        'message' => 'Ordonnance enregistrée avec succès',
        'donnees' => $ordonnance,
        ]);    }

    /**
     * Display the specified resource.
     */
    public function show(Ordonnance $ordonnance)
    {
        return response()->json([
            'donnees' => $ordonnance
        ]);    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ordonnance $ordonnance)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrdonnanceRequest $request, Ordonnance $ordonnance)
    {
        $donnees = $request->validated();

        if ($request->hasFile('scan')) {
            $donnees['scan_path'] = Storage::url($request->file('scan')->store('ordonnances', 'public'));
            unset($donnees['scan']);
        }

        $ordonnance->update($donnees);

    return response()->json([
        'message' => 'Ordonnance mise à jour avec succès',
        'donnees' => $ordonnance
    ]);    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ordonnance $ordonnance)
    {
        $ordonnance->delete();

        return response()->json([
            'message' => 'Ordonnance supprimée avec succès',
        ]);    }
}
