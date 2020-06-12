<?php

namespace ChatApp\App;

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class Chat implements MessageComponentInterface {
  protected $clients;

  public function __construct () {
    $this->clients = new \SplObjectStorage();
  }

  public function onOpen (ConnectionInterface $conn) {
    $path = $conn->httpRequest->getUri()->getPath();
    $channel = explode('/', $path)[1];
    $this->clients->attach($conn, ['channel' => $channel]);
    echo "New connection was attached: {$conn->resourceId}\n";
  }

  public function onMessage (ConnectionInterface $from, $msg) {
    $json = json_decode($msg, true);
    $json['from'] = $from->resourceId;

    if ($json === null || !$json['name'] || !$json['content']) return;
    else $msg = json_encode($json);

    $clients = $this->getChannelUsers($from);
    foreach ($clients as $client) $client->send($msg);
  }

  public function onClose (ConnectionInterface $conn) {
    $this->clients->detach($conn);
    echo "Connection {$conn->resourceId} had disconnected\n";
  }

  public function onError (ConnectionInterface $conn, \Exception $e) {
    $conn->close();
    echo "An error has occured: {$e->getMessage()}\n";
  }

  private function getChannelUsers (ConnectionInterface $conn) {
    $channel = '';
    $clients = [];

    $this->clients->rewind();
    while ($this->clients->valid()) {
      $client = $this->clients->current();
      $info = $this->clients->getInfo();

      if ($client === $conn) {
        $channel = $info['channel'];
        break;
      }

      $this->clients->next();
    }

    $this->clients->rewind();
    while ($this->clients->valid()) {
      $client = $this->clients->current();
      $info = $this->clients->getInfo();

      if ($info['channel'] === $channel) array_push($clients, $client);
      $this->clients->next();
    }

    return $clients;
  }
}

?>
