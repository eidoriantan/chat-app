<?php

$config = [
  'port' => isset($_SERVER['PORT']) ? $_SERVER['PORT'] : 8000,
  'ssl' => [
    'certificate' => isset($_SERVER['SSL_CERT']) ? $_SERVER['SSL_CERT'] : '',
    'key' => isset($_SERVER['SSL_KEY']) ? $_SERVER['SSL_KEY'] : ''
  ]
];

?>
