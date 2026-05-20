<?php

namespace App\Http\Controllers;

use App\Models\Fournisseur;
use App\Models\Medicament;
use App\Models\PurchaseOrder;
use App\Models\StockMovement;
use App\Models\Vente;
use App\Models\VenteItem;
use Illuminate\Http\Request;

class ReportController
{
    public function sales(Request $request)
    {
        $requete = $this->requeteVentes($request);

        return response()->json([
            'titre' => 'Rapport des ventes',
            'nombre_ventes' => (clone $requete)->count(),
            'montant_total_ventes' => (clone $requete)->sum('total'),
            'remises_totales' => (clone $requete)->sum('discount_amount'),
            'ventes_par_jour' => (clone $requete)
                ->selectRaw('DATE(sold_at) as date, COUNT(*) as nombre_ventes, SUM(total) as montant_total')
                ->groupBy('date')
                ->orderBy('date')
                ->get(),
        ]);
    }

    public function stock()
    {
        return response()->json([
            'titre' => 'Rapport du stock',
            'nombre_medicaments' => Medicament::count(),
            'nombre_alertes_stock_faible' => Medicament::whereColumn('qte_dispo', '<=', 'qte_min')->count(),
            'nombre_medicaments_expires' => Medicament::whereDate('date_expiration', '<', now())->count(),
            'valeur_stock_achat' => Medicament::selectRaw('SUM(qte_dispo * prix_achat) as valeur')->value('valeur') ?? 0,
            'valeur_stock_vente' => Medicament::selectRaw('SUM(qte_dispo * prix_vente) as valeur')->value('valeur') ?? 0,
            'mouvements_recents' => StockMovement::with('medicament')->latest()->limit(20)->get(),
        ]);
    }

    public function financial(Request $request)
    {
        $ventes = $this->requeteVentes($request);
        $idsVentes = (clone $ventes)->pluck('id');
        $chiffreAffaires = (clone $ventes)->sum('total');
        $coutMarchandises = VenteItem::whereIn('vente_id', $idsVentes)
            ->selectRaw('SUM(quantity * unit_purchase_price) as cout')
            ->value('cout') ?? 0;

        $achats = PurchaseOrder::query();
        $this->appliquerPeriode($achats, $request, 'ordered_at');

        return response()->json([
            'titre' => 'Rapport financier',
            'chiffre_affaires' => $chiffreAffaires,
            'cout_marchandises_vendues' => $coutMarchandises,
            'benefice_brut' => $chiffreAffaires - $coutMarchandises,
            'achats_fournisseurs' => $achats->sum('total_amount'),
        ]);
    }

    public function suppliers(Request $request)
    {
        $commandes = PurchaseOrder::query();
        $this->appliquerPeriode($commandes, $request, 'ordered_at');

        return response()->json([
            'titre' => 'Rapport des fournisseurs',
            'nombre_commandes' => (clone $commandes)->count(),
            'montant_total' => (clone $commandes)->sum('total_amount'),
            'par_fournisseur' => Fournisseur::withSum(['purchaseOrders as montant_total' => function ($requete) use ($request) {
                $this->appliquerPeriode($requete, $request, 'ordered_at');
            }], 'total_amount')->get(),
        ]);
    }

    public function medicines()
    {
        return response()->json([
            'titre' => 'Rapport des médicaments',
            'medicaments_plus_vendus' => Medicament::withCount('venteItems')->orderByDesc('vente_items_count')->limit(10)->get(),
            'alertes_stock_faible' => Medicament::whereColumn('qte_dispo', '<=', 'qte_min')->orderBy('qte_dispo')->get(),
            'expirations_proches' => Medicament::whereBetween('date_expiration', [now(), now()->addDays(60)])->orderBy('date_expiration')->get(),
        ]);
    }

    private function requeteVentes(Request $request)
    {
        $requete = Vente::query();
        $this->appliquerPeriode($requete, $request, 'sold_at');

        return $requete;
    }

    private function appliquerPeriode($requete, Request $request, string $colonne): void
    {
        if ($request->filled('from')) {
            $requete->whereDate($colonne, '>=', $request->date('from'));
        }

        if ($request->filled('to')) {
            $requete->whereDate($colonne, '<=', $request->date('to'));
        }
    }
}
