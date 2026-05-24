<?php

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Max-Age: 86400');
    http_response_code(204);
    exit();
}

$tmpStorage = '/tmp/laravel-storage';

foreach ([
    $tmpStorage . '/app/public',
    $tmpStorage . '/framework/cache/data',
    $tmpStorage . '/framework/sessions',
    $tmpStorage . '/framework/testing',
    $tmpStorage . '/framework/views',
    $tmpStorage . '/logs',
] as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

$_ENV['APP_STORAGE_PATH'] = $tmpStorage;

ini_set('display_errors', 1);
error_reporting(E_ALL);

function formatException(\Throwable $e): array {
    return [
        'message'  => $e->getMessage(),
        'class'    => get_class($e),
        'file'     => str_replace('/var/task/user', '', $e->getFile()),
        'line'     => $e->getLine(),
        'trace'    => array_slice(array_map(
            fn($t) => str_replace('/var/task/user', '', ($t['file'] ?? '?')) . ':' . ($t['line'] ?? '?'),
            $e->getTrace()
        ), 0, 10),
        'previous' => $e->getPrevious() ? formatException($e->getPrevious()) : null,
    ];
}

try {
    require __DIR__ . '/../public/index.php';
} catch (\Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(formatException($e), JSON_PRETTY_PRINT);
}