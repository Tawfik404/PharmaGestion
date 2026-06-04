<?php

namespace App\Exports;

use App\Models\Medicament;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class MedicamentsExport implements FromArray, ShouldAutoSize, WithHeadings, WithTitle
{
    public function headings(): array
    {
        return [
            'Numero',
            'Photo',
            'Designation',
            'Categorie',
            "Prix d achat",
            'Prix de vente',
            'Quantite minimale',
            'Quantite disponible',
            'Utilisations',
            'Contre-indications',
            'Effets secondaires',
            'Taux de prise en charge',
            'Code-barres',
            "Date d expiration",
        ];
    }

    public function array(): array
    {
        return Medicament::query()
            ->orderBy('designation')
            ->get()
            ->map(fn (Medicament $medicament) => [
                'Numero' => $medicament->numero,
                'Photo' => $medicament->photo,
                'Designation' => $medicament->designation,
                'Categorie' => $medicament->categorie,
                "Prix d achat" => $this->formatMontant($medicament->prix_achat),
                'Prix de vente' => $this->formatMontant($medicament->prix_vente),
                'Quantite minimale' => $this->formatQuantite($medicament->qte_min),
                'Quantite disponible' => $this->formatQuantite($medicament->qte_dispo),
                'Utilisations' => $medicament->utilisations,
                'Contre-indications' => $medicament->contre_indications,
                'Effets secondaires' => $medicament->effets_secondaires,
                'Taux de prise en charge' => $this->formatPourcentage($medicament->taux_prise_en_charge),
                'Code-barres' => $medicament->code_barre,
                "Date d expiration" => $medicament->date_expiration?->format('d/m/Y'),
            ])
            ->toArray();
    }

    public function title(): string
    {
        return 'Medicaments';
    }

    private function formatMontant($montant): string
    {
        return number_format((float) $montant, 2, ',', ' ').' MAD';
    }

    private function formatPourcentage($pourcentage): string
    {
        return number_format((float) $pourcentage, 2, ',', ' ').' %';
    }

    private function formatQuantite($quantite): string
    {
        return number_format((int) $quantite, 0, ',', ' ');
    }
}
