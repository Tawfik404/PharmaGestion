<?php

echo json_encode([
    'php_version'     => PHP_VERSION,
    'app_key_set'     => !empty($_ENV['APP_KEY'] ?? getenv('APP_KEY')),
    'app_key_prefix'  => substr(getenv('APP_KEY') ?: '', 0, 10),
    'app_key_length'  => strlen(getenv('APP_KEY') ?: ''),
    'db_host_set'     => !empty(getenv('DB_HOST')),
    'db_host_partial' => substr(getenv('DB_HOST') ?: '', 0, 15) . '...',
    'storage_writable'=> is_writable('/tmp'),
    'bootstrap_cache' => glob(__DIR__ . '/../bootstrap/cache/*.php'),
    'php_extensions'  => get_loaded_extensions(),
]);