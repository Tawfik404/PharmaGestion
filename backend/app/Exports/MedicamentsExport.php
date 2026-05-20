<?php

namespace App\Exports;

use App\Models\Medicament;
use Maatwebsite\Excel\Facades\Excel;

class MedicamentsExport
{
    public function download()
    {
        $lignes = Medicament::query()
            ->orderBy('designation')
            ->get()
            ->map(fn (Medicament $medicament) => [
                'Numero' => $medicament->numero,
                'Photo' => $medicament->photo,
                'Designation' => $medicament->designation,
                'Categorie' => $medicament->categorie,
                'Prix d achat' => $this->formatMontant($medicament->prix_achat),
                'Prix de vente' => $this->formatMontant($medicament->prix_vente),
                'Quantite minimale' => $this->formatQuantite($medicament->qte_min),
                'Quantite disponible' => $this->formatQuantite($medicament->qte_dispo),
                'Utilisations' => $medicament->utilisations,
                'Contre-indications' => $medicament->contre_indications,
                'Effets secondaires' => $medicament->effets_secondaires,
                'Taux de prise en charge' => $this->formatPourcentage($medicament->taux_prise_en_charge),
                'Code-barres' => $medicament->code_barre,
                'Date d expiration' => $medicament->date_expiration?->format('d/m/Y'),
            ])
            ->toArray();

        return Excel::create('medicaments', function ($excel) use ($lignes) {
            $excel->sheet('Medicaments', function ($feuille) use ($lignes) {
                $feuille->fromArray($lignes);
                $feuille->setAutoSize(true);
            });
        })->download('xlsx');
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
