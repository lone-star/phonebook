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
				+ '/phones/'
				+ (_.isUndefined(this.id) ? '' : this.id);
		},
		validation: {
			number: {
				required: true,
				rangeLength: [3, 20]
			},
			type: {
				required: true,                           
				oneOf: ['home', 'cellular', 'work', 'other']
			}
		}
  });

  // Default collection.
  PhoneEntry.Collection = Backbone.Collection.extend({
    model: PhoneEntry.Model,
		url: function() {
			return app.root
				+ 'server/index.php/contacts/'
				+ PhoneEntry.getContactId()
				+ '/phones/';
		}
  });

	// Attach the Views sub-module
	PhoneEntry.Views = Views.Views;

	// Attach the setModel method
	PhoneEntry.setContactModel = Views.setContactModel;
	PhoneEntry.getContactId = Views.getContactId;

  // Return the module for AMD compliance.
  return PhoneEntry;

});
