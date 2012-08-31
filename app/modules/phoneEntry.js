define([
  // Application.
  'app',

	// Libs
	'backbone',

	// Views
	'modules/phoneEntry/views'
	
],

// Map dependencies from above array.
function(app, Backbone, Views) {

  // Create a new module.
  var PhoneEntry = app.module();
	
  // Default model.
  PhoneEntry.Model = Backbone.Model.extend({
		url: function() {
			return app.root
				+ 'server/index.php/contacts/'
				+ PhoneEntry.getContactId()
				+ '/phones/';
		}
  });

  // Default collection.
  PhoneEntry.Collection = Backbone.Collection.extend({
    model: PhoneEntry.Model
  });

	// Attach the Views sub-module
	PhoneEntry.Views = Views.Views;

	// Attach the setModel method
	PhoneEntry.setContactModel = Views.setContactModel;
	PhoneEntry.getContactId = Views.getContactId;

  // Return the module for AMD compliance.
  return PhoneEntry;

});
