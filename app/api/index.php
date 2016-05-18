<?php

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require '../../vendor/autoload.php';

$app = new \Slim\App();

$app->get('/emotions/', function (Request $request, Response $response) {
    return $response->withJson([ 'emotions' => [ 'sad', 'amused' ]]);
});

$app->run();
