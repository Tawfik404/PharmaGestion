<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    require __DIR__ . '/../public/index.php';
} catch (\Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'message' => $e->getMessage(),
        'class'   => get_class($e),
        'file'    => str_replace(dirname(__DIR__), '', $e->getFile()),
        'line'    => $e->getLine(),
        'trace'   => array_slice(
            array_map(
                fn($t) => ($t['file'] ?? '?') . ':' . ($t['line'] ?? '?'),
                $e->getTrace()
            ),
            0, 10  // first 10 frames only
        ),
    ]);
}