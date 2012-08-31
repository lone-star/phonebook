<?php

// Slim Framework
require 'Slim/Slim.php';

$app = new Slim();

// Contacts

// Create
$app->post('/contacts/', function () use ($app) {
	$app->response()->status(200);
});

// Retreive
$app->get('/contacts/', function () use ($app) {
	$app->response()->status(200);
});

$app->run();


?>
