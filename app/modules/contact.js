define([
  // Application.
  'app',

	// Libs
	'backbone',

	// Views
	'modules/contact/views'
],

// Map dependencies from above array.
function(app, Backbone, Views) {

  // Create a new module.
  var Contact = app.module();

  // Default model.
  Contact.Model = Backbone.Model.extend({
  
  });

  // Default collection.
  Contact.Collection = Backbone.Collection.extend({
    model: Contact.Model
  });

	// Attach the Views sub-module
	Contact.Views = Views;

  // Return the module for AMD compliance.
  return Contact;

});
