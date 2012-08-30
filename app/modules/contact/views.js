define([
	//Application
	'app',

	//Libs
	'backbone'
],

function(app, Backbone) {
  var Views = {};

	Views.Item = Backbone.View.extend({
		template: 'contact/item',
		tagName: 'li',
		serialize: function() {
			return {
				first_name: this.model.get('first_name'),
				last_name: this.model.get('last_name')
			};
		},
		updatedAttributes: function() {
			return {
				first_name: this.$('.first_name-input').val(),
				last_name: this.$('.last_name-input').val()
			};
		}
	});

	Views.List = Backbone.View.extend({
		tagName: 'ul',
		render: function(manage) {
		}
	});

	Views.Form = Backbone.View.extend({
		template: 'contact/form',
		newAttributes: function() {
			return {
				first_name: this.$('#new-contact-first_name').val(),
				last_name: this.$('#new-contact-last_name').val()
			};
		}
	});

	return Views;
});

