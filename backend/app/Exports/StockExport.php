<?php

namespace App\Exports;

use App\Models\StockMovement;
use Maatwebsite\Excel\Facades\Excel;

class StockExport
{
    public function download()
    {
        $lignes = StockMovement::query()
            ->with('medicament')
            ->latest()
            ->get()
            ->map(fn (StockMovement $mouvement) => [
                'Identifiant' => $mouvement->id,
                'Medicament' => $mouvement->medicament?->designation,
                'Code-barres' => $mouvement->medicament?->code_barre,
                'Type de mouvement' => $this->libelleType($mouvement->type),
                'Quantite' => $this->formatQuantite($mouvement->quantity),
                'Stock avant' => $this->formatQuantite($mouvement->stock_before),
                'Stock apres' => $this->formatQuantite($mouvement->stock_after),
                'Cout unitaire' => $mouvement->unit_cost !== null ? $this->formatMontant($mouvement->unit_cost) : '',
                'Notes' => $mouvement->notes,
                'Date du mouvement' => $mouvement->created_at?->format('d/m/Y H:i'),
            ])
            ->toArray();

        return Excel::create('stock_pharmacie', function ($excel) use ($lignes) {
            $excel->sheet('Stock pharmacie', function ($feuille) use ($lignes) {
                $feuille->fromArray($lignes);
                $feuille->setAutoSize(true);
            });
        })->download('xlsx');
    }

    private function libelleType(string $type): string
    {
        return match ($type) {
            'entree' => 'Entree de stock',
            'vente' => 'Vente',
            default => ucfirst($type),
        };
    }

    private function formatMontant($montant): string
    {
        return number_format((float) $montant, 2, ',', ' ').' MAD';
    }

    private function formatQuantite($quantite): string
    {
        return number_format((int) $quantite, 0, ',', ' ');
    }
}
