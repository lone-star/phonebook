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
		url: function() {
			
			return app.root 
				+ 'server/index.php/contacts/'
				+ (_.isUndefined(this.id) ? '' : this.id);
		},
		validation: {
			first_name: {
				required: true,
				rangeLength: [3, 40],
			},
			last_name: {
				required: true,
				rangeLength: [3, 40],
			}
		}
  });

  // Default collection.
  Contact.Collection = Backbone.Collection.extend({
		url: app.root + 'server/index.php/contacts/',
    model: Contact.Model,
		comparator: function(contact) {
			return contact.get('last_name').toLowerCase();
		}
  });

	// Attach the Views sub-module
	Contact.Views = Views;

  // Return the module for AMD compliance.
  return Contact;
});
