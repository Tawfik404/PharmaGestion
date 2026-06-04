<?php

namespace App\Exports;

use App\Models\Vente;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class VentesExport implements FromArray, ShouldAutoSize, WithHeadings, WithTitle
{
    public function headings(): array
    {
        return [
            'Date',
            'Client',
            'Total',
            'Reduction',
            'Net a payer',
            'Mode de paiement',
            'Caissier',
        ];
    }

    public function array(): array
    {
        return Vente::with(['client', 'admin'])
            ->latest('sold_at')
            ->get()
            ->map(function (Vente $vente) {
                return [
                    'Date' => $vente->sold_at?->format('d/m/Y H:i'),
                    'Client' => $vente->client ? ($vente->client->prenom . ' ' . $vente->client->nom) : ($vente->customer_name ?: 'Client anonyme'),
                    'Total' => number_format((float) $vente->subtotal, 2, ',', ' ') . ' MAD',
                    'Reduction' => number_format((float) $vente->discount_amount, 2, ',', ' ') . ' MAD (' . (float)$vente->discount_rate . '%)',
                    'Net a payer' => number_format((float) $vente->total, 2, ',', ' ') . ' MAD',
                    'Mode de paiement' => ucfirst($vente->payment_method),
                    'Caissier' => $vente->admin ? ($vente->admin->prenom . ' ' . $vente->admin->nom) : 'Système',
                ];
            })
            ->toArray();
    }

    public function title(): string
    {
        return 'Ventes';
    }
}
