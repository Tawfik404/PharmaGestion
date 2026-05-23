<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrdonnanceRequest;
use App\Http\Requests\UpdateOrdonnanceRequest;
use App\Models\Ordonnance;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class OrdonnanceController
{
    private array $relations = ['client', 'medecin', 'medicaments'];

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(
            Ordonnance::with($this->relations)
                ->latest('date_ordonnance')
                ->get()
        );
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

        $ordonnance = DB::transaction(function () use ($donnees) {
            $ordonnance = Ordonnance::create([
                'numero' => $donnees['numero'] ?: $this->genererNumero(),
                'client_id' => $donnees['client_id'],
                'medecin_id' => $donnees['medecin_id'] ?? null,
                'date_ordonnance' => $donnees['date_ordonnance'],
                'notes' => $donnees['notes'] ?? null,
                'scan_path' => $donnees['scan_path'] ?? null,
            ]);

            $ordonnance->medicaments()->sync([
                $donnees['medicament_id'] => [
                    'dosage_medicament' => $donnees['dosage_medicament'],
                    'instructions_posologie' => $donnees['instructions_posologie'],
                ],
            ]);

            return $ordonnance->load($this->relations);
        });

        return response()->json([
            'message' => 'Ordonnance enregistrée avec succès',
            'donnees' => $ordonnance,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Ordonnance $ordonnance)
    {
        return response()->json([
            'donnees' => $ordonnance->load($this->relations),
        ]);
    }

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

        DB::transaction(function () use ($donnees, $ordonnance) {
            $miseAJour = [];

            foreach (['numero', 'client_id', 'medecin_id', 'date_ordonnance', 'notes', 'scan_path'] as $champ) {
                if (array_key_exists($champ, $donnees)) {
                    $miseAJour[$champ] = $donnees[$champ];
                }
            }

            if ($miseAJour !== []) {
                $ordonnance->update($miseAJour);
            }

            if (isset($donnees['medicament_id'])) {
                $ordonnance->medicaments()->sync([
                    $donnees['medicament_id'] => [
                        'dosage_medicament' => $donnees['dosage_medicament'] ?? '',
                        'instructions_posologie' => $donnees['instructions_posologie'] ?? '',
                    ],
                ]);
            }
        });

        return response()->json([
            'message' => 'Ordonnance mise à jour avec succès',
            'donnees' => $ordonnance->load($this->relations),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ordonnance $ordonnance)
    {
        $ordonnance->delete();

        return response()->json([
            'message' => 'Ordonnance supprimée avec succès',
        ]);
    }

    private function genererNumero(): string
    {
        return 'ORD-'.now()->format('Ymd-His-u');
    }
}
