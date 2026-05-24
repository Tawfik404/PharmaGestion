<?php

// Handle CORS preflight before Laravel touches anything
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Max-Age: 86400');
    http_response_code(204);
    exit();
}

$tmpStorage   = '/tmp/laravel-storage';
$tmpBootstrap = '/tmp/laravel-bootstrap';

// Create dirs FIRST
foreach ([
    $tmpStorage . '/app/public',
    $tmpStorage . '/framework/cache/data',
    $tmpStorage . '/framework/sessions',
    $tmpStorage . '/framework/testing',
    $tmpStorage . '/framework/views',
    $tmpStorage . '/logs',
    $tmpBootstrap . '/cache',  // must exist before copy
] as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

// THEN copy package discovery files
$realBootstrap = __DIR__ . '/../bootstrap/cache';
$tmpCache      = $tmpBootstrap . '/cache';

foreach (['packages.php', 'services.php'] as $file) {
    $src  = $realBootstrap . '/' . $file;
    $dest = $tmpCache . '/' . $file;
    if (file_exists($src) && !file_exists($dest)) {
        copy($src, $dest);
    }
}

$_ENV['APP_STORAGE_PATH']   = $tmpStorage;
$_ENV['APP_BOOTSTRAP_PATH'] = $tmpBootstrap;

require __DIR__ . '/../public/index.php';