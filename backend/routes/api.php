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
        ->middleware('role:pharmacien,gestionnaire,caissier');
    Route::get('/medicament/alerts/low-stock', [MedicamentController::class, 'lowStock']);
    Route::get('/medicament/barcode/{barcode}', [MedicamentController::class, 'barcode']);
    Route::post('/medicament/{medicament}/replenish', [MedicamentController::class, 'replenish'])
        ->middleware('role:pharmacien,gestionnaire');

    Route::get('/client/{client}/stats', [ClientController::class, 'stats'])
        ->middleware('role:pharmacien,gestionnaire');
    Route::get('/client/export/excel', [ClientController::class, 'export'])
        ->middleware('role:pharmacien,gestionnaire');

    Route::get('/stock', [StockController::class, 'index'])
        ->middleware('role:pharmacien,gestionnaire');
    Route::get('/stock/export/excel', [StockController::class, 'export'])
        ->middleware('role:pharmacien,gestionnaire');

    Route::get('/vente', [VenteController::class, 'index'])
        ->middleware('role:caissier,pharmacien,gestionnaire');
    Route::get('/vente/export/excel', [VenteController::class, 'export'])
        ->middleware('role:pharmacien');
    Route::post('/vente', [VenteController::class, 'store'])
        ->middleware('role:caissier,pharmacien');
    Route::get('/vente/{vente}', [VenteController::class, 'show'])
        ->middleware('role:caissier,pharmacien,gestionnaire');

    Route::get('/fournisseur/{fournisseur}/orders', [FournisseurController::class, 'orders'])
        ->middleware('role:pharmacien,gestionnaire');
    Route::post('/fournisseur/{fournisseur}/orders', [FournisseurController::class, 'storeOrder'])
        ->middleware('role:gestionnaire');
    Route::get('/fournisseur/{fournisseur}/stats', [FournisseurController::class, 'stats'])
        ->middleware('role:pharmacien,gestionnaire');

    Route::prefix('reports')->middleware('role:pharmacien,gestionnaire')->group(function () {
        Route::get('/sales', [ReportController::class, 'sales']);
        Route::get('/stock', [ReportController::class, 'stock']);
        Route::get('/financial', [ReportController::class, 'financial']);
        Route::get('/suppliers', [ReportController::class, 'suppliers']);
        Route::get('/medicines', [ReportController::class, 'medicines']);
    });
    
    Route::apiResource('admin', AdminController::class)->middleware('role:gestionnaire');
    Route::get('/client', [ClientController::class, 'index'])->middleware('role:caissier,gestionnaire,pharmacien');
    Route::get('/client/{client}', [ClientController::class, 'show'])->middleware('role:caissier,gestionnaire,pharmacien');
    Route::post('/client', [ClientController::class, 'store'])->middleware('role:caissier,gestionnaire');
    Route::put('/client/{client}', [ClientController::class, 'update'])->middleware('role:caissier,gestionnaire');
    Route::patch('/client/{client}', [ClientController::class, 'update'])->middleware('role:caissier,gestionnaire');
    Route::delete('/client/{client}', [ClientController::class, 'destroy'])->middleware('role:caissier,gestionnaire');
    Route::get('/fournisseur', [FournisseurController::class, 'index'])->middleware('role:gestionnaire,pharmacien');
    Route::get('/fournisseur/{fournisseur}', [FournisseurController::class, 'show'])->middleware('role:gestionnaire,pharmacien');
    Route::post('/fournisseur', [FournisseurController::class, 'store'])->middleware('role:gestionnaire');
    Route::put('/fournisseur/{fournisseur}', [FournisseurController::class, 'update'])->middleware('role:gestionnaire');
    Route::patch('/fournisseur/{fournisseur}', [FournisseurController::class, 'update'])->middleware('role:gestionnaire');
    Route::delete('/fournisseur/{fournisseur}', [FournisseurController::class, 'destroy'])->middleware('role:gestionnaire');
    Route::apiResource('medecin', MedecinController::class)->middleware('role:gestionnaire,pharmacien');
    Route::get('/medicament', [MedicamentController::class, 'index'])->middleware('role:caissier,gestionnaire,pharmacien');
    Route::get('/medicament/{medicament}', [MedicamentController::class, 'show'])->middleware('role:caissier,gestionnaire,pharmacien');
    Route::post('/medicament', [MedicamentController::class, 'store'])->middleware('role:gestionnaire,pharmacien');
    Route::put('/medicament/{medicament}', [MedicamentController::class, 'update'])->middleware('role:gestionnaire,pharmacien');
    Route::patch('/medicament/{medicament}', [MedicamentController::class, 'update'])->middleware('role:gestionnaire,pharmacien');
    Route::delete('/medicament/{medicament}', [MedicamentController::class, 'destroy'])->middleware('role:gestionnaire,pharmacien');
    Route::apiResource('ordonnance', OrdonnanceController::class)->middleware('role:pharmacien');
        
        });

Route::post('/login', [AuthController::class, 'login']);
