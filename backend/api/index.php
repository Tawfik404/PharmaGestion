<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Vercel: only /tmp is writable
$tmpStorage = '/tmp/laravel-storage';
$tmpBootstrap = '/tmp/laravel-bootstrap';

// Create all required writable dirs
foreach ([
    $tmpStorage . '/app/public',
    $tmpStorage . '/framework/cache/data',
    $tmpStorage . '/framework/sessions',
    $tmpStorage . '/framework/testing',
    $tmpStorage . '/framework/views',
    $tmpStorage . '/logs',
    $tmpBootstrap . '/cache',
] as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

$_ENV['APP_STORAGE_PATH']   = $tmpStorage;
$_ENV['APP_BOOTSTRAP_PATH'] = $tmpBootstrap;

require __DIR__ . '/../public/index.php';