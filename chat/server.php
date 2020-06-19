<?php

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use React\EventLoop\Factory;
use React\Socket\Server;
use React\Socket\SecureServer;
use ChatApp\App\Chat;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/config.php';

$chat = new Chat();
$ws_server = new WsServer($chat);
$app = new HttpServer($ws_server);

$port = $config['port'];
$cert = $config['ssl']['certificate'];
$key = $config['ssl']['key'];

if ($cert === '' || $key === '') {
  die('SSL certificate and/or private key was not provided.');
}

if (!file_exists($cert) || !file_exists($key)) {
  die('SSL certificate and/or private key was not found');
}

$loop = Factory::create();
$websockets = new Server("0.0.0.0:$port", $loop);
$websockets = new SecureServer($websockets, $loop, [
  'local_cert' => $cert,
  'local_pk' => $key,
  'verify_peer' => false,
  'allow_self_signed' => $development
]);

$server = new IoServer($app, $websockets, $loop);
echo "Server is running on port: $port\r\n";
$server->run();

?>
