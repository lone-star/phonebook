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
		// Provide attributes for the template
		serialize: function() {
			return {
				first_name: this.model.escape('first_name'),
				last_name: this.model.escape('last_name')
			};
		},
		updatedAttributes: function() {
			return {
				first_name: this.$('.first_name-input').val(),
				last_name: this.$('.last_name-input').val()
			};
		},
		initialize: function() {
			// When the model is updated
			this.model.on('change', function() {
				this.render();
			}, this);

			// To keep the model synced with the server
			this.intervalSync = setInterval(_.bind(function() {
				this.model.fetch({error: this.errorFetchingModel});
			}, this), 10000);

			// When the model is destroyed
			this.model.on('destroy', function() {
				// Stop checking the server
				clearInterval(this.intervalSync);
			}, this);
			
			// Binding methods
			this.errorFetchingModel = _.bind(this.errorFetchingModel, this);
		},
		errorFetchingModel: function(model, error) {
			// The model has been destroyed from the server
			if (error.status === 404) {
				this.model.destroy();
			}
		},
		startEdit: function() {
			this.$el.addClass('editing');
			// Don't trigger parent element
			return false;
		},
		finishEdit: function() {
      // Get the attributes
			var attr = this.updatedAttributes();
			this.$('.save-item').popover('destroy');

			// Verify validation
			if(!this.model.set(attr)){
				this.$('.save-item').popover({
					animation: 'show',
					placement: 'bottom',
					title: 'Error',
					content: _.bind(function() {
						
						// For each attributes of the model
						return _.chain(_.keys(this.model.attributes))

							// Get the validation message error
							.map(function(key) {
								return this.model.preValidate(key, attr[key]);
							}, this)

							// Reject attribute if there is no validation message error
							.reject(function(str) {
								return _.isEmpty(str);
							})

							// Generate message to display
							.reduce(function(m, n) {
								return (_.isNull(m) ? '' : m + '<br/><br/>') + n;
							}, null)
							.value();
					}, this)
				});
				this.$('.save-item').popover('show');
			} else {
				this.$el.removeClass('editing');
				this.model.save();
			}
		},
		removeItem: function() {
			PhoneEntry.setContactModel(null);
			this.model.destroy();
			// Don't trigger parent element
			return false;
		},
		showPhone: function() {
			PhoneEntry.setContactModel(this.model);
			$('.phone-arrow').removeClass('selected-row');
			this.$('.phone-arrow').addClass('selected-row');
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

			// Listen for collection reset
			this.collection.on('reset', function() {
				this.render();
			}, this);

			// Listen for new models
			this.collection.on('add', function(item) {
				this.insertView(new Views.Item({
					model: item
				})).render();
				// Keep the collection sorted
				this.collection.sort();
			}, this);

			// Listen for delete models
			this.collection.on('remove', function(item) {
				this.getView(function(view) {
					return view.model === item;
				}).remove();
			}, this);

			// Listen for changes of the models
			this.collection.on('change', function() {
				this.collection.sort();
			}, this);

			// Keep the contact list up to date
			setInterval(_.bind(function() {
				this.collection.fetch({add: true});
			}, this), 10000);
			
		},
	});

	Views.Form = Backbone.View.extend({
		template: 'contacts/form',
		events:{
			'click #new-contact-submit': 'toggleSubmit'
		},
		// Gets the attributes of the form
		newAttributes: function() {
			return {
				first_name: this.$('#new-contact-first_name').val(),
				last_name: this.$('#new-contact-last_name').val()
			};
		},
		toggleSubmit: function() {
			var model = new this.collection.model(this.newAttributes());
			
			// Validation
			this.$('#new-contact-submit').popover('destroy');
			if(!model.isValid(['first_name', 'last_name'])){
				this.$('#new-contact-submit').popover({
					animation: 'show',
					placement: 'bottom',
					title: 'Error',
					content: function() {
						// Concatenate each field inside a string for display
						return _.reduce(model.validate(), function(m, n) {
							return (_.isNull(m) ? '' : m + '<br/><br/>') + n;
						}, null);
					}
				});
				this.$('#new-contact-submit').popover('show');
			} else {
				model.save();
				this.collection.add(model);
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

