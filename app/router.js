define([
  // Application.
  'app',

	// Modules
	'modules/contact',
	'modules/phoneEntry'
],

function(app, Contact, PhoneEntry) {

  var Router = Backbone.Router.extend({
    routes: {
      "": "index"
    },

    index: function() {
			// Create a new list of contacts
			var contacts = new Contact.Collection();

      // Set the initial contactModel
			PhoneEntry.setContactModel(contacts.first());

			var phoneEntries = new PhoneEntry.Collection();

			// Use the main layout
			app.useLayout('main').setViews({

				// Attach the Contact form
				".contact-form": new Contact.Views.Form({
					collection: contacts
				}),

				// Attach the Contact list
				".contact-list": new Contact.Views.List({
					collection: contacts
				}),

				// Attach the PhoneEntry form
				".phone-form": new PhoneEntry.Views.Form({
					collection: phoneEntries
				}),

				// Attach the PhoneEntry list
				".phone-list": new PhoneEntry.Views.List({
					collection: phoneEntries
				})
			}).render();

			// Get the collection
			contacts.fetch();
    }
  });
  return Router;

});
