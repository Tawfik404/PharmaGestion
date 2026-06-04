<?php

namespace App\Exports;

use App\Models\Client;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class ClientsExport implements FromArray, ShouldAutoSize, WithHeadings, WithTitle
{
    public function headings(): array
    {
        return [
            'Nom',
            'Prenom',
            'Telephone',
            'Email',
            'Date de naissance',
            'Adresse',
            'Reduction',
            'Achats Total',
        ];
    }

    public function array(): array
    {
        return Client::with(['ventes'])
            ->get()
            ->map(function (Client $client) {
                return [
                    'Nom' => $client->nom,
                    'Prenom' => $client->prenom,
                    'Telephone' => $client->telephone,
                    'Email' => $client->email,
                    'Date de naissance' => $client->date_naissance?->format('d/m/Y'),
                    'Adresse' => $client->adresse,
                    'Reduction' => $client->is_discounted ? $client->discount_rate . '%' : 'Non',
                    'Achats Total' => number_format((float) $client->ventes->sum('total'), 2, ',', ' ') . ' MAD',
                ];
            })
            ->toArray();
    }

    public function title(): string
    {
        return 'Clients';
    }
}
