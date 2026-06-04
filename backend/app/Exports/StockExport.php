<?php

namespace App\Exports;

use App\Models\StockMovement;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class StockExport implements FromArray, ShouldAutoSize, WithHeadings, WithTitle
{
    public function headings(): array
    {
        return [
            'Identifiant',
            'Medicament',
            'Code-barres',
            'Type de mouvement',
            'Quantite',
            'Stock avant',
            'Stock apres',
            'Cout unitaire',
            'Notes',
            'Date du mouvement',
        ];
    }

    public function array(): array
    {
        return StockMovement::query()
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
    }

    public function title(): string
    {
        return 'Stock pharmacie';
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
