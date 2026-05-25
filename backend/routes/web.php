<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


Route::get('/run-migrations', function () {
    if (request('token') !== env('MIGRATE_TOKEN')) {
        abort(403);
    }
    
    Artisan::call('migrate', ['--seed' => true, '--force' => true]);
    return response()->json([
        'output' => Artisan::output()
    ]);
});