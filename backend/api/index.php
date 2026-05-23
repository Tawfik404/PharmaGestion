<?php
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