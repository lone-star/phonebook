define([
	//Application
	'app',

	//Libs
	'backbone'
],

function(app, Backbone) {
  var Views = {};

	Views.Item = Backbone.View.extend({
		template: 'contacts/item',
		tagName: 'li',
		events: {
			'click .edit-item': 'startEdit',
			'click .save-item': 'finishEdit',
			'click .remove-item': 'removeItem'
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
			//console.log('start edit');
		},
		finishEdit: function() {
			//console.log('finish edit');
      this.model.set(this.updatedAttributes());
		},
		removeItem: function() {
			//console.log('remove Item');
			this.model.destroy();
		}
	});

	Views.List = Backbone.View.extend({
		tagName: 'ul',
		render: function(manage) {
			this.collection.each(function(item){
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

			//listen for delete modele
			this.collection.on('remove', function(item){
				this.getView(function(view) {
					return view.model === item;
				}).remove();
			}, this);
		}
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

