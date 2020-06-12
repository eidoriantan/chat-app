<?php

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use ChatApp\App\Chat;

require_once __DIR__ . '/../vendor/autoload.php';

$chat = new Chat();
$ws_server = new WsServer($chat);
$http_server = new HttpServer($ws_server);

$server = IoServer::factory($http_server, 8000);
echo 'Server is running on port 8000\r\n';
$server->run();

?>
