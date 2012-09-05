Javascript Developer Exercise
=============================

Dependencies
------------

### Server
Because of the simplicity of the problem, we have chose to implement the web services with a minimalistic solution. The server uses the slim framework for its RESTfull web services, and it uses idiorm as an ORM.

### Client
The client uses the following libraries:
* Require JS for managing its dependancies
* Backbone JS for building the views and models
* Backbone.LayoutManager for giving more power to the backbone views.
* Backbone.Validation for simplifying the declaration of validators.
* Twitter Bootstrap for the UI
* Lodash as replacement of underscore
* Jasmine JS for conducting the tests
* And of course jquery

Installation
------------
First clone it in your website directory: `git clone git://github.com/benjamin-michel/phonebook.git`

### Database
To install the database, import `/server/phonebook.sql` in your database. 

### Server
Set your database connection data at the begining of the file `/server/index.php`

### Client
You need tell the client what is your root URL. For instance after cloning the project you have the `phonebook` file in you website directory and you can access it using `http://localhost/~user/phonebook/`. In this case, the root URL would be `/~user/phonebook/`.
You need to set this value in the file `/app/app.js`.

Architecture
------------

### Database
The database is composed of thwo tables:

#### Contact
* id (int, primary key)
* first_name (varchar)
* last_name (varchar)

#### Phone
* id (int, primary key)
* contact_id (int, foreign key)
* number (varchar)
* type (varchar)


### Server
The Server offers a simple web service and is limited to letting the backbone client keep a state of synchronization between its resources and the stored resources.

#### Contacts:
* List: `GET /contacts`
* Create: `POST /contacts`
* Update: `PUT /contacts/:id`
* Delete: `DELETE /contacts/:id`
* Item: `GET /contacts/:id`

#### PhoneEntries:
* List: `GET /contacts/:contact_id/phones`
* Create: `POST /contacts/:contact_id/phones`
* Update: `PUT /contacts/:contact_id/phones/:id`
* Delete: `PUT /contacts/:contact_id/phones/:id`
* Item: `GET /contacts/:contact_id/phones/:id`

### Client
The client is divided in two modules: contacts and phoneEntries. Each one of them corresponding to their respective resources.

Each module implements a default Backbone model and a default Backbone collection. These are in charge of keeping the data valid and synchronizing it with the server.

Modules also implement three views each: Form, List, Item.

* Form: Enables the creation of new instances of the models
* List: Displayes the models and stay aware of addition or deletion of models
* Item: Provides a finer granularity by keeping the model's attributes synced. It also enables edit, and delete operations

Improvements
------------

### Grunt
The project was originaly built with the Backbone Boilerplate Build Tool. It comes with the Grunt build tool and in the case of a continuous development, a better integration with the built-in toold would be prefered.
To use Grunt commands, install the grunt-bbb application.

### Client views improvements
It would be possible to generalize the behavior of the Contact and PhoneEntry views since much of the functions and the behavior they implement is similar.
To do so we would extend the Backbone Views with the function which are similar or that we consider standard.

### Tests
Tests currently focuse on the views functionalities. They do not consider the synchronization, or the existance of multiple clients.
In order to make them effective, the tests should implement these requirements. 
