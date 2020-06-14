<?php

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use ChatApp\App\Chat;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/config.php';

$chat = new Chat();
$ws_server = new WsServer($chat);
$http_server = new HttpServer($ws_server);

$port = $config['port'];
$server = IoServer::factory($http_server, $port);
echo "Server is running on port $port\r\n";
$server->run();

?>
