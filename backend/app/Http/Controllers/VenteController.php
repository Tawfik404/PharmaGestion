<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Medicament;
use App\Models\StockMovement;
use App\Models\Vente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VenteController
{
    public function index(Request $request)
    {
        $requete = Vente::with(['client', 'admin', 'items.medicament'])->latest('sold_at');

        if ($request->filled('from')) {
            $requete->whereDate('sold_at', '>=', $request->date('from'));
        }

        if ($request->filled('to')) {
            $requete->whereDate('sold_at', '<=', $request->date('to'));
        }

        return response()->json(['donnees' => $requete->get()]);
    }

    public function store(Request $request)
    {
        $donnees = $request->validate([
            'client_id' => ['sometimes', 'nullable', 'exists:clients,id'],
            'customer_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'discount_rate' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'payment_method' => ['sometimes', 'string', 'max:50'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.medicament_id' => ['required_without:items.*.barcode', 'exists:medicaments,id'],
            'items.*.barcode' => ['required_without:items.*.medicament_id', 'string'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ], [
            'items.required' => 'La vente doit contenir au moins un médicament.',
            'items.min' => 'La vente doit contenir au moins un médicament.',
            'items.*.medicament_id.required_without' => 'Le médicament ou le code-barres est obligatoire.',
            'items.*.medicament_id.exists' => 'Le médicament sélectionné est introuvable.',
            'items.*.barcode.required_without' => 'Le code-barres ou le médicament est obligatoire.',
            'items.*.quantity.required' => 'La quantité est obligatoire.',
            'items.*.quantity.integer' => 'La quantité doit être un nombre entier.',
            'items.*.quantity.min' => 'La quantité doit être supérieure à zéro.',
            'discount_rate.min' => 'La remise ne peut pas être négative.',
            'discount_rate.max' => 'La remise ne peut pas dépasser 100%.',
        ]);

        $vente = DB::transaction(function () use ($donnees, $request) {
            $client = isset($donnees['client_id']) ? Client::find($donnees['client_id']) : null;
            $sousTotal = 0;
            $lignesResolues = [];

            foreach ($donnees['items'] as $ligne) {
                $medicament = isset($ligne['medicament_id'])
                    ? Medicament::lockForUpdate()->findOrFail($ligne['medicament_id'])
                    : Medicament::lockForUpdate()->where('code_barre', $ligne['barcode'])->firstOrFail();

                if ($medicament->qte_dispo < $ligne['quantity']) {
                    abort(422, "Stock insuffisant pour {$medicament->designation}");
                }

                $totalLigne = (float) $medicament->prix_vente * (int) $ligne['quantity'];
                $sousTotal += $totalLigne;
                $lignesResolues[] = [$medicament, (int) $ligne['quantity'], $totalLigne];
            }

            $tauxRemise = (float) ($donnees['discount_rate'] ?? ($client?->is_discounted ? $client->discount_rate : 0));
            $montantRemise = round($sousTotal * $tauxRemise / 100, 2);
            $total = max(0, round($sousTotal - $montantRemise, 2));

            $vente = Vente::create([
                'client_id' => $client?->id,
                'admin_id' => $request->user()?->id,
                'customer_name' => $donnees['customer_name'] ?? null,
                'subtotal' => $sousTotal,
                'discount_rate' => $tauxRemise,
                'discount_amount' => $montantRemise,
                'total' => $total,
                'payment_method' => $donnees['payment_method'] ?? 'especes',
                'sold_at' => now(),
            ]);

            foreach ($lignesResolues as [$medicament, $quantite, $totalLigne]) {
                $stockAvant = (int) $medicament->qte_dispo;
                $stockApres = $stockAvant - $quantite;

                $vente->items()->create([
                    'medicament_id' => $medicament->id,
                    'quantity' => $quantite,
                    'unit_purchase_price' => $medicament->prix_achat,
                    'unit_sale_price' => $medicament->prix_vente,
                    'line_total' => $totalLigne,
                ]);

                $medicament->update(['qte_dispo' => $stockApres]);

                StockMovement::create([
                    'medicament_id' => $medicament->id,
                    'admin_id' => $request->user()?->id,
                    'type' => 'vente',
                    'quantity' => -$quantite,
                    'stock_before' => $stockAvant,
                    'stock_after' => $stockApres,
                    'notes' => 'Vente POS '.$vente->id,
                ]);
            }

            return $vente->load(['client', 'admin', 'items.medicament']);
        });

        return response()->json([
            'message' => 'Vente enregistrée avec succès',
            'recu' => $vente,
        ], 201);
    }

    public function show(Vente $vente)
    {
        return response()->json(['donnees' => $vente->load(['client', 'admin', 'items.medicament'])]);
    }
}
