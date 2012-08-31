<?php

// Slim Framework
require 'Slim/Slim.php';

$app = new Slim();

// Contacts

// Create
$app->post('/contacts/', function () use ($app) {
	$app->response()->status(200);
});

// List
$app->get('/contacts/', function () use ($app) {
	$app->response()->status(200);
});


// Destroy
$app->delete('/contacts/:id', function ($id) use ($app) {
	$app->response()->status(200);
});

// PhoneEntries

// Create
$app->post('/contacts/:contact_id/phones/', function () use ($app) {
	$app->response()->status(200);
});

// List
$app->get('/contacts/:contact_id/phones/',
		function ($contact_id) use ($app) {
	$response = $app->response();
	$response['Contant-Type'] = 'application/json';
	$response->status(200);
});

$app->run();


?>
