<?php

// Vercel has read-only filesystem — redirect all Laravel writes to /tmp
$tmpStorage = '/tmp/laravel-storage';

$dirs = [
    'app/public',
    'framework/cache/data',
    'framework/sessions',
    'framework/testing',
    'framework/views',
    'logs',
];

foreach ($dirs as $dir) {
    $path = $tmpStorage . '/' . $dir;
    if (!is_dir($path)) {
        mkdir($path, 0755, true);
    }
}

// Also make bootstrap/cache writable via /tmp
$bootstrapCache = '/tmp/laravel-bootstrap-cache';
if (!is_dir($bootstrapCache)) {
    mkdir($bootstrapCache, 0755, true);
}

// Tell Laravel to use these /tmp paths
$_ENV['APP_STORAGE_PATH']    = $tmpStorage;
$_ENV['APP_BOOTSTRAP_CACHE'] = $bootstrapCache;

require __DIR__ . '/../public/index.php';