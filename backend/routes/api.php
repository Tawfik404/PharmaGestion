<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\FournisseurController;
use App\Http\Controllers\MedecinController;
use App\Http\Controllers\MedicamentController;
use App\Http\Controllers\OrdonnanceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\VenteController;

Route::middleware('auth:sanctum')->group(function () {
    
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/medicament/export/excel', [MedicamentController::class, 'export'])
        ->middleware('role:pharmacien,gestionnaire');
    Route::get('/medicament/alerts/low-stock', [MedicamentController::class, 'lowStock']);
    Route::get('/medicament/barcode/{barcode}', [MedicamentController::class, 'barcode']);
    Route::post('/medicament/{medicament}/replenish', [MedicamentController::class, 'replenish'])
        ->middleware('role:pharmacien,gestionnaire');

    Route::get('/client/{client}/stats', [ClientController::class, 'stats'])
        ->middleware('role:pharmacien,gestionnaire');

    Route::get('/stock', [StockController::class, 'index'])
        ->middleware('role:pharmacien,gestionnaire');
    Route::get('/stock/export/excel', [StockController::class, 'export'])
        ->middleware('role:pharmacien,gestionnaire');

    Route::get('/vente', [VenteController::class, 'index'])
        ->middleware('role:caissier,pharmacien,gestionnaire');
    Route::post('/vente', [VenteController::class, 'store'])
        ->middleware('role:caissier,pharmacien,gestionnaire');
    Route::get('/vente/{vente}', [VenteController::class, 'show'])
        ->middleware('role:caissier,pharmacien,gestionnaire');

    Route::get('/fournisseur/{fournisseur}/orders', [FournisseurController::class, 'orders'])
        ->middleware('role:pharmacien,gestionnaire');
    Route::post('/fournisseur/{fournisseur}/orders', [FournisseurController::class, 'storeOrder'])
        ->middleware('role:pharmacien,gestionnaire');
    Route::get('/fournisseur/{fournisseur}/stats', [FournisseurController::class, 'stats'])
        ->middleware('role:pharmacien,gestionnaire');

    Route::prefix('reports')->middleware('role:gestionnaire')->group(function () {
        Route::get('/sales', [ReportController::class, 'sales']);
        Route::get('/stock', [ReportController::class, 'stock']);
        Route::get('/financial', [ReportController::class, 'financial']);
        Route::get('/suppliers', [ReportController::class, 'suppliers']);
        Route::get('/medicines', [ReportController::class, 'medicines']);
    });
    
    Route::apiResource('admin', AdminController::class)->middleware('role:gestionnaire');
    Route::apiResource('client', ClientController::class)->middleware('role:caissier,pharmacien,gestionnaire');
    Route::apiResource('fournisseur', FournisseurController::class)->middleware('role:pharmacien,gestionnaire');
    Route::apiResource('medecin', MedecinController::class)->middleware('role:pharmacien,gestionnaire');
    Route::apiResource('medicament', MedicamentController::class)->middleware('role:caissier,pharmacien,gestionnaire');
    Route::apiResource('ordonnance', OrdonnanceController::class)->middleware('role:pharmacien,gestionnaire');
        
        });

Route::post('/login', [AuthController::class, 'login']);

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok'
    ]);
});
