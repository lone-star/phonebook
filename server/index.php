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

// Load idiorm
require 'idiorm.php';

// Database connection with middleware
class DBConnectionMiddleware extends Slim_Middleware{

	// Entry point
	public function call(){

		// Initialize the database
		ORM::configure('mysql:host=localhost;dbname=phonebook');
		ORM::configure('username', 'root');
		ORM::configure('password', '');

		// Execute the application
		$this->next->call();

		//set content type
		$response = $this->app->response();
		$response['Content-Type'] = 'application/json';
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
	// Get the contacts
	$contacts = ORM::for_table('contact')->find_many();

	// Put in array
	$res = array();
	foreach($contacts as $contact)
		$res[] = $contact->as_array();
	 
	$app->response()->status(200);
	$app->response()->body(json_encode($res));
});

// Create
$app->post('/contacts/', function () use ($app) {
	// Get the params
	$params = json_decode($app->request()->getBody(), true);

	// Create contact
	$contact = ORM::for_table('contact')->create();
	$contact->first_name = $params['first_name'];
	$contact->last_name = $params['last_name'];
	$contact->save();

	if ($contact->id()) { // Success
		// Give the Contact's data
		$app->redirect($contact->id());
	} else { // Failure
		$app->response()->status(404);
	}
});

// Update
$app->put('/contacts/:id', function($id) use ($app) {
	// Get the params
	$params = json_decode($app->request()->getBody(), true);

	// Update contact
	$contact = ORM::for_table('contact')->find_one($id);
	$contact->first_name = $params['first_name'];
	$contact->last_name = $params['last_name'];
	$contact->save();

	if ($contact->id()) { // Success
		$app->response()->status(200);
	} else { // Failure
		$app->response()->status(404);
	}
});

// Destroy
$app->delete('/contacts/:id', function ($id) use ($app) {

	// Delete the contact
	$contact = ORM::for_table('contact')->find_one($id);
	$contact->delete();

	$app->response()->status(200);
});

// Item
$app->get('/contacts/:id', function($id) use ($app) {

	// Get the contact
	$contact = ORM::for_table('contact')->find_one($id);

	if ($contact) { // Success
		$app->response()->status(200);
		$app->response()->body(json_encode($contact->as_array()));
	} else { // Failure
		$app->response()->status(404);
	}
});

/*
 * PhoneEntries
 */

// List
$app->get('/contacts/:contact_id/phones/', function ($contact_id) use ($app) {

	// Find the phones
	$phones = ORM::for_table('phone')
		->where('contact_id', $contact_id)
		->find_many();

	// Put in array
	$res = array();
	foreach($phones as $phone)
		$res[] = $phone->as_array();

	$app->response()->status(200);
	$app->response()->body(json_encode($res));
});

// Create
$app->post('/contacts/:contact_id/phones/', function ($contact_id) use ($app) {
	// Get parameters
	$params = json_decode($app->request()->getBody(), true);

	// Create Phone
	$phone = ORM::for_table('phone')->create();
	$phone->contact_id = $params['contact_id'];
	$phone->number = $params['number'];
	$phone->type = $params['type'];
	$phone->save();

	if ($phone->id()) { // Success
		// Give the Phone's data
		$app->response()->status(200);
		$app->redirect($phone->id());
	} else { // Failure
		$app->response()->status(404);
	}
});

//Update
$app->put('/contacts/:contact_id/phones/:id', function($contact_id, $id) use ($app) {
	// Get parameters
	$params = json_decode($app->request()->getBody(), true);

	// Update the data
	$phone = ORM::for_table('phone')->find_one($id);
	$phone->number = $params['number'];
	$phone->type = $params['type'];
	$phone->save();

	if ($phone->id()) { // Success
		$app->response()->status(200);
	} else { // Failure
		$app->response()->status(404);
	}
});

//Destroy
$app->delete('/contacts/:contact_id/phones/:id', function ($contact_id, $id) use ($app) {
	
	// Delete
	$phone = ORM::for_table('phone')->find_one($id);
	$phone->delete();

	$app->response()->status(200);
});

// Item
$app->get('/contacts/:contact_id/phones/:id', function($contact_id, $id) use ($app) {

	// Get the phone
	$phone = ORM::for_table('phone')->find_one($id);

	if ($phone) { // Success
		$app->response()->status(200);
		$app->response()->body(json_encode($phone->as_array()));
	} else { // Failure
		$app->response()->status(404);
	}
});


//Run application
$app->run();


?>
