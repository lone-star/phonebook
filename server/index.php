<?php

/* *
 * Initialization:
 * 		-loading the slim framework
 * 		-initializing the database
 *
 * */

// Slim Framework
require 'Slim/Slim.php';
$app = new Slim();

// Database connection with middleware
class DBConnectionMiddleware extends Slim_Middleware{

	// Entry point
	public function call(){

		// Initialize the database
		$this->app->db = mysql_connect('localhost', 'root', ''); 
		if (!mysql_select_db('phonebook', $this->app->db))
			throw new Exception('Cannot open the "phonebook" database');

		// Execute the application
		$this->next->call();

		//set content type
		$response = $this->app->response();
		$response['Content-Type'] = 'application/json';

		mysql_close($this->app->db);
	}
}
// Add middleware to app
$app->add(new DBConnectionMiddleware());

/* * 
 * Rest API
 *
 * There are two resources: Contacts and PhoneEntries.
 * Each resource have the following methods:
 * 		- List   > Listing of each resources of this type
 * 		- Create > Make a new resource, will redirect to the Item
 * 		- Update > Update a resource
 * 		- Delete > Delete a resource
 * 		- Item   > Get the data corresponding to a single resource
 *
 * */

/*
 * Contacts
 */

// List
$app->get('/contacts/', function () use ($app) {
	$sql = 'SELECT * FROM Contact';
	$qry = mysql_query($sql, $app->db);
	$res = array();
	while ($row = mysql_fetch_object($qry))
		$res[] = $row;

	$app->response()->status(200);
	$app->response()->body(json_encode($res));
});

// Create
$app->post('/contacts/', function () use ($app) {
	$params = json_decode($app->request()->getBody(), true);
	$sql = 'INSERT INTO Contact (first_name, last_name) VALUES ("'
		. $params['first_name'] . '", "'
		. $params['last_name'] . '")';

	if (mysql_query($sql, $app->db)) { // Success
		// Give the Contact's data
		$app->redirect(mysql_insert_id());
	} else { // Failure
		$app->response()->status(404);
		$app->response()->body(mysql_error());
	}
});

// Update
$app->put('/contacts/:id', function($id) use ($app) {
	$params = json_decode($app->request()->getBody(), true);
	$sql = 'UPDATE Contact SET '
		. 'first_name = "' . $params['first_name'] . '", '
		. 'last_name = "' . $params['last_name'] . '" '
		. 'WHERE id=' . $id;

	if (mysql_query($sql, $app->db)) { // Success
		$app->response()->status(200);
	} else { // Failure
		$app->response()->status(404);
		$app->response()->body(mysql_error());
	}
});

// Destroy
$app->delete('/contacts/:id', function ($id) use ($app) {
	$sql = 'DELETE FROM Contact WHERE id = ' . $id;

	if (mysql_query($sql, $app->db)) { // Success
		$app->response()->status(200);
	} else { // Failure
		$app->response()->status(404);
		$app->response()->body(mysql_error());
	}
});

// Item
$app->get('/contacts/:id', function($id) use ($app) {
	$sql = 'SELECT * FROM Contact WHERE id = ' . $id;
	$qry = mysql_query($sql, $app->db);

	if ($item = mysql_fetch_object($qry)) { // Success
		$app->response()->status(200);
		$app->response()->body(json_encode($item));
	} else { // Failure
		$app->response()->status(404);
		$app->response()->body(mysql_error());
	}
});

/*
 * PhoneEntries
 */

// List
$app->get('/contacts/:contact_id/phones/', function ($contact_id) use ($app) {
	$sql = 'SELECT * FROM Phone WHERE contact_id = ' . $contact_id;
	$qry = mysql_query($sql, $app->db);
	$res = array();
	while ($row = mysql_fetch_object($qry))
		$res[] = $row;

	$app->response()->status(200);
	$app->response()->body(json_encode($res));
});

// Create
$app->post('/contacts/:contact_id/phones/', function ($contact_id) use ($app) {
	$app->response()->status(200);
	$params = json_decode($app->request()->getBody(), true);
	$sql = 'INSERT INTO Phone (contact_id, number, type) VALUES ('
		. $params['contact_id'] . ', "'
		. $params['number'] . '", "'
		. $params['type'] . '")';

	if (mysql_query($sql, $app->db)) { // Success
		// Give the Phone's data
		$app->redirect(mysql_insert_id());
	} else { // Failure
		$app->response()->status(404);
		$app->response()->body(mysql_error());
	}
});

//Update
$app->put('/contacts/:contact_id/phones/:id', function($contact_id, $id) use ($app) {
	$params = json_decode($app->request()->getBody(), true);
	$sql = 'UPDATE Phone SET '
		. 'number = "' . $params['number'] . '", '
		. 'type = "' . $params['type'] . '" '
		. 'WHERE id=' . $id;

	if (mysql_query($sql, $app->db)) { // Success
		$app->response()->status(200);
	} else { // Failure
		$app->response()->status(404);
		$app->response()->body(mysql_error());
	}
});

//Destroy
$app->delete('/contacts/:contact_id/phones/:id', function ($contact_id, $id) use ($app) {
	$sql = 'DELETE FROM Phone WHERE id = ' . $id;

	if (mysql_query($sql, $app->db)) { // Success
		$app->response()->status(200);
	} else { // Failure
		$app->response()->status(404);
		$app->response()->body(mysql_error());
	}
});

// Item
$app->get('/contacts/:contact_id/phones/:id', function($contact_id, $id) use ($app) {
	$sql = 'SELECT * FROM Phone WHERE id = ' . $id;
	$qry = mysql_query($sql, $app->db);

	if ($item = mysql_fetch_object($qry)) { // Success
		$app->response()->status(200);
		$app->response()->body(json_encode($item));
	} else { // Failure
		$app->response()->status(404);
		$app->response()->body(mysql_error());
	}
});


//Run application
$app->run();


?>
