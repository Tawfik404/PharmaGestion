<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use Illuminate\Http\Request;

class ClientController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $clients = Client::with(['ventes' => function ($requete) {
            $requete->latest('sold_at');
        }])->get()->map(function (Client $client) {
            $derniereVente = $client->ventes->sortByDesc('sold_at')->first();

            return [
                'id' => $client->id,
                'nom' => $client->nom,
                'prenom' => $client->prenom,
                'telephone' => $client->telephone,
                'email' => $client->email,
                'date_naissance' => $client->date_naissance?->format('Y-m-d'),
                'adresse' => $client->adresse,
                'is_discounted' => $client->is_discounted,
                'discount_rate' => (float) $client->discount_rate,
                'achats_total' => (float) $client->ventes->sum('total'),
                'derniere_visite' => $derniereVente?->sold_at?->format('Y-m-d'),
            ];
        });

        return response()->json($clients);
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
    public function store(StoreClientRequest $request)
    {
        //
        $client = Client::create($request->validated());

        return response()->json([
        'message' => 'Client ajouté avec succès',
        'donnees' => $client,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Client $client)
    {
        //
        return response()->json([
            'donnees' => $client
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Client $client)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClientRequest $request, Client $client)
    {
        $client->update($request->validated());

    return response()->json([
        'message' => 'Client mis à jour avec succès',
        'donnees' => $client
    ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client)
    {
        $client->delete();

        return response()->json([
            'message' => 'Client supprimé avec succès',
        ]);
    }

    public function stats(Request $request, Client $client)
    {
        $requete = $client->ventes()->withCount('items');

        if ($request->filled('from')) {
            $requete->whereDate('sold_at', '>=', $request->date('from'));
        }

        if ($request->filled('to')) {
            $requete->whereDate('sold_at', '<=', $request->date('to'));
        }

        $ventes = $requete->get();

        return response()->json([
            'client' => $client,
            'periode' => [
                'debut' => $request->get('from'),
                'fin' => $request->get('to'),
            ],
            'montant_total_achats' => $ventes->sum('total'),
            'nombre_ventes' => $ventes->count(),
            'nombre_articles' => $ventes->sum('items_count'),
        ]);
    }

}
