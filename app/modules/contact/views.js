define([
	//Application
	'app',

	//Modules
	'modules/phoneEntry',

	//Libs
	'backbone'
],

function(app, PhoneEntry, Backbone) {
  var Views = {};

	Views.Item = Backbone.View.extend({
		template: 'contacts/item',
		tagName: 'li',
		events: {
			'click .edit-item': 'startEdit',
			'click .save-item': 'finishEdit',
			'click .remove-item': 'removeItem',
			'click .display': 'showPhone'
		},
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
		},
		initialize: function() {
			this.model.on('change', function() {
				this.render();
			}, this);
		},
		startEdit: function() {
			// console.log('start edit');
			this.$el.addClass('editing');
			//don't trigger parent element
			return false;
		},
		finishEdit: function() {
			// console.log('finish edit');
			this.$el.removeClass('editing');
      this.model.set(this.updatedAttributes());
		},
		removeItem: function() {
			// console.log('remove Item');
			PhoneEntry.setContactModel(null);
			this.model.destroy();
			// don't trigger parent element
			return false;
		},
		showPhone: function() {
			// console.log('show phone');
			PhoneEntry.setContactModel(this.model);
		}
	});

	Views.List = Backbone.View.extend({
		tagName: 'ul',
		beforeRender: function() {
			this.collection.each(function(item){
				this.insertView(new Views.Item({
					model: item
				}));
			}, this);
		},
		initialize: function() {
			// Style of the list
			this.$el.addClass('unstyled');

			//listen for new models
			this.collection.on('add', function(item) {
				this.insertView(new Views.Item({
					model: item
				})).render();
			}, this);

			//listen for delete models
			this.collection.on('remove', function(item) {
				this.getView(function(view) {
					return view.model === item;
				}).remove();
			}, this);
			
		},
	});

	Views.Form = Backbone.View.extend({
		template: 'contacts/form',
		events:{
			'click #new-contact-submit': 'toggleSubmit'
		},
		newAttributes: function() {
			return {
				first_name: this.$('#new-contact-first_name').val(),
				last_name: this.$('#new-contact-last_name').val()
			};
		},
		toggleSubmit: function() {
			if(!this.collection.create(this.newAttributes())){
				console.log('data not valid');
			} else {
				this.clean();
			}
		},
		clean: function() {
			this.$('#new-contact-first_name').val('');
			this.$('#new-contact-last_name').val('');
		}
	});


	return Views;
});

