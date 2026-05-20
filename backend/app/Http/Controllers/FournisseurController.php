<?php

namespace App\Http\Controllers;

use App\Models\Fournisseur;
use App\Models\PurchaseOrder;
use App\Http\Requests\StoreFournisseurRequest;
use App\Http\Requests\UpdateFournisseurRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FournisseurController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Fournisseur::all());
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
    public function store(StoreFournisseurRequest $request)
    {
       $fournisseur = Fournisseur::create($request->validated());

        return response()->json([
        'message' => 'Fournisseur ajouté avec succès',
        'donnees' => $fournisseur,
        ]);    }

    /**
     * Display the specified resource.
     */
    public function show(Fournisseur $fournisseur)
    {
        return response()->json([
            'donnees' => $fournisseur
        ]);    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Fournisseur $fournisseur)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFournisseurRequest $request, Fournisseur $fournisseur)
    {
        $fournisseur->update($request->validated());

    return response()->json([
        'message' => 'Fournisseur mis à jour avec succès',
        'donnees' => $fournisseur
    ]);    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Fournisseur $fournisseur)
    {
        $fournisseur->delete();

        return response()->json([
            'message' => 'Fournisseur supprimé avec succès',
        ]);    }

    public function orders(Fournisseur $fournisseur)
    {
        return response()->json([
            'donnees' => $fournisseur->purchaseOrders()->with('items.medicament')->latest()->get(),
        ]);
    }

    public function storeOrder(Request $request, Fournisseur $fournisseur)
    {
        $donnees = $request->validate([
            'status' => ['sometimes', 'string', 'max:50'],
            'ordered_at' => ['sometimes', 'nullable', 'date'],
            'received_at' => ['sometimes', 'nullable', 'date'],
            'notes' => ['sometimes', 'nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.medicament_id' => ['required', 'exists:medicaments,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
        ], [
            'items.required' => 'La commande doit contenir au moins un médicament.',
            'items.min' => 'La commande doit contenir au moins un médicament.',
            'items.*.medicament_id.required' => 'Le médicament est obligatoire pour chaque ligne de commande.',
            'items.*.medicament_id.exists' => 'Le médicament sélectionné est introuvable.',
            'items.*.quantity.required' => 'La quantité est obligatoire pour chaque ligne de commande.',
            'items.*.quantity.min' => 'La quantité doit être supérieure à zéro.',
            'items.*.unit_price.required' => 'Le prix unitaire est obligatoire pour chaque ligne de commande.',
            'items.*.unit_price.min' => 'Le prix unitaire ne peut pas être négatif.',
        ]);

        $commande = DB::transaction(function () use ($donnees, $fournisseur, $request) {
            $total = collect($donnees['items'])->sum(fn ($ligne) => $ligne['quantity'] * $ligne['unit_price']);

            $commande = PurchaseOrder::create([
                'fournisseur_id' => $fournisseur->id,
                'admin_id' => $request->user()?->id,
                'status' => $donnees['status'] ?? 'commandee',
                'ordered_at' => $donnees['ordered_at'] ?? now()->toDateString(),
                'received_at' => $donnees['received_at'] ?? null,
                'total_amount' => $total,
                'notes' => $donnees['notes'] ?? null,
            ]);

            foreach ($donnees['items'] as $ligne) {
                $commande->items()->create([
                    'medicament_id' => $ligne['medicament_id'],
                    'quantity' => $ligne['quantity'],
                    'unit_price' => $ligne['unit_price'],
                    'line_total' => $ligne['quantity'] * $ligne['unit_price'],
                ]);
            }

            return $commande->load('items.medicament');
        });

        return response()->json([
            'message' => 'Commande enregistrée avec succès',
            'donnees' => $commande,
        ], 201);
    }

    public function stats(Request $request, Fournisseur $fournisseur)
    {
        $requete = $fournisseur->purchaseOrders();

        if ($request->filled('from')) {
            $requete->whereDate('ordered_at', '>=', $request->date('from'));
        }

        if ($request->filled('to')) {
            $requete->whereDate('ordered_at', '<=', $request->date('to'));
        }

        $commandes = $requete->get();

        return response()->json([
            'fournisseur' => $fournisseur,
            'nombre_commandes' => $commandes->count(),
            'montant_total' => $commandes->sum('total_amount'),
            'periode' => [
                'debut' => $request->get('from'),
                'fin' => $request->get('to'),
            ],
        ]);
    }
}
