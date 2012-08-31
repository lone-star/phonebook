define([
	//Application
	'app',

	//Libs
	'backbone'
],

function(app, Backbone) {
	var Views = {};

	//Contact Event will keep the views updated of the currently
	//displayed contact
	var contactEvent = {
		model: null,
		
		//This function takes in an instance of <Contact.Model>
		setModel: function(model) {
			this.model = model;
			this.trigger('modelset', this.model);
		}
	};
	_.extend(contactEvent, Backbone.Events);
	_.bindAll(contactEvent);

	Views.Item = Backbone.View.extend({
		tagName: 'li',
		template: 'phoneEntry/item',
		events: {
			'click .edit-item': 'startEdit',
			'click .save-item': 'finishEdit',
			'click .remove-item': 'removeItem'
		},
    serialize: function() {
			return {
				number: this.model.get('number'),
				type: this.model.get('type'),
				phone_types: ['home', 'work', 'cellular', 'other']
			};
		},
		updatedAttributes: function() {
			return {
				number: this.$('.number-input').val(),
				type: this.$('.type-input').val()
			};
		},
		initialize: function() {
			this.model.on('change', function() {
				this.render();
			}, this);
		},
		startEdit: function() {
			//console.log('start edit');
		},
		finishEdit: function() {
			//console.log('finish edit');
			this.model.set(this.updatedAttributes());
		},
		removeItem: function() {
			//console.log('remove item');
			this.model.destroy();
		}
	});


	Views.List = Backbone.View.extend({
		tagName: 'ul',
		render: function(manage) {
			this.collection.each(function(item) {
				this.insertView(new Views.Item({
					model: item
				}));
			}, this);

			return manage(this).render();
		},
		initialize: function() {
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

			//listen for modification of the contact model
			contactEvent.on('modelset', function() {
				this.collection.url = app.root
					+ 'server/index.php/contacts/'
					+ contactEvent.model.get('id')
					+ '/phones/';
				this.collection.fetch();
				
			}, this);
			
			//listen for reset of the collection
			this.collection.on('reset', function() {
				this.render();
				/*
				console.log(this.el);
				this.render(function(el) {
					console.log(el);
					console.log(this.collection.length);
				}, this);

				console.log(this.collection);
				*/
			}, this);
		}
	});


	Views.Form = Backbone.View.extend({
		template: 'phoneEntry/form',
		events: {
			'click #new-phone-submit': 'toggleSubmit'
		},
		newAttributes: function() {
			return {
				number: this.$('#new-phone-number').val(),
				type: this.$('#new-phone-type').val(),
				contact_id: contactEvent.model.id
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
			this.$('#new-phone-number').val('');
			this.$('option:selected').prop('selected', false);
		},
		serialize: function() {
			return {
				phone_types: ['home', 'work', 'cellular', 'other']
			};
		}
	});

	return {
		Views: Views,
		setContactModel: contactEvent.setModel,
		getContactId: function() {
			return contactEvent.model.get('id')
		}
	};
});
