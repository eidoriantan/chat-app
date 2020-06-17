<?php

$config = [
  'port' => isset($_SERVER['PORT']) ? $_SERVER['PORT'] : 8000,
  'ssl' => [
    'certificate' => '/home/eidoriantan/0000_cert.pem',
    'key' => '/home/eidoriantan/private.key'
  ]
];

?>
