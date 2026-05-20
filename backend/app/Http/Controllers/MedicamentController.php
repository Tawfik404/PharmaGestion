<?php

namespace App\Http\Controllers;

use App\Exports\MedicamentsExport;
use App\Models\Medicament;
use App\Models\StockMovement;
use App\Http\Requests\StoreMedicamentRequest;
use App\Http\Requests\UpdateMedicamentRequest;
use Cloudinary\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class MedicamentController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $requete = Medicament::query();

        if ($request->filled('barcode')) {
            $requete->where('code_barre', $request->barcode);
        }

        if ($request->filled('category')) {
            $requete->where('categorie', $request->category);
        }

        match ($request->input('sort')) {
            'category' => $requete->orderBy('categorie')->orderBy('designation'),
            'sales' => $requete->withCount('venteItems')->orderByDesc('vente_items_count'),
            'numero' => $requete->orderBy('numero'),
            default => $requete->orderBy('designation'),
        };

        return response()->json($requete->get());
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
    public function store(StoreMedicamentRequest $request)
    {

    
        $donnees = $request->validated();

        if ($request->hasFile('photo')) {
            $donnees['photo'] = $this->storePhoto($request);
        }

        $medicament = Medicament::create($donnees);

        return response()->json([
        'message' => 'Médicament ajouté avec succès',
        'donnees' => $medicament,
        ]);    
        }

    /**
     * Display the specified resource.
     */
    public function show(Medicament $medicament)
    {
        return response()->json([
            'donnees' => $medicament
        ]);    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Medicament $medicament)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMedicamentRequest $request, Medicament $medicament)
    {
        $donnees = $request->validated();

        if ($request->hasFile('photo')) {
            $donnees['photo'] = $this->storePhoto($request);
        }

        $medicament->update($donnees);

    return response()->json([
        'message' => 'Médicament mis à jour avec succès',
        'donnees' => $medicament
    ]);    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Medicament $medicament)
    {
        $medicament->delete();

        return response()->json([
            'message' => 'Médicament supprimé avec succès',
        ]);    }

    public function barcode(string $barcode)
    {
        return response()->json([
            'donnees' => Medicament::where('code_barre', $barcode)->firstOrFail(),
        ]);
    }

    public function lowStock()
    {
        return response()->json([
            'message' => 'Alerte de stock faible',
            'donnees' => Medicament::whereColumn('qte_dispo', '<=', 'qte_min')->orderBy('designation')->get(),
        ]);
    }

    public function replenish(Request $request, Medicament $medicament)
    {
        $donnees = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
            'unit_cost' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'notes' => ['sometimes', 'nullable', 'string'],
        ], [
            'quantity.required' => 'La quantité à ajouter est obligatoire.',
            'quantity.integer' => 'La quantité doit être un nombre entier.',
            'quantity.min' => 'La quantité doit être supérieure à zéro.',
            'unit_cost.numeric' => 'Le coût unitaire doit être un nombre valide.',
            'unit_cost.min' => 'Le coût unitaire ne peut pas être négatif.',
        ]);

        $mouvement = DB::transaction(function () use ($donnees, $medicament, $request) {
            $stockAvant = (int) $medicament->qte_dispo;
            $stockApres = $stockAvant + (int) $donnees['quantity'];

            $medicament->update(['qte_dispo' => $stockApres]);

            return StockMovement::create([
                'medicament_id' => $medicament->id,
                'admin_id' => $request->user()?->id,
                'type' => 'entree',
                'quantity' => $donnees['quantity'],
                'stock_before' => $stockAvant,
                'stock_after' => $stockApres,
                'unit_cost' => $donnees['unit_cost'] ?? null,
                'notes' => $donnees['notes'] ?? null,
            ]);
        });

        return response()->json([
            'message' => 'Stock réapprovisionné avec succès',
            'donnees' => $mouvement->load('medicament'),
        ], 201);
    }

    public function export()
    {
        return (new MedicamentsExport)->download();
    }

    private function storePhoto(Request $request): string
    {
        if (config('services.cloudinary.cloud_url') || env('CLOUDINARY_URL')) {
            $cloudinary = new Cloudinary();
            $upload = $cloudinary->uploadApi()->upload(
                $request->file('photo')->getRealPath(),
                ['folder' => 'medPhotos']
            );

            return $upload['secure_url'];
        }

        return Storage::url($request->file('photo')->store('medPhotos', 'public'));
    }
}
