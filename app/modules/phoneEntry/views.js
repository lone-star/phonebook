define([
	//Application
	'app',

	//Libs
	'backbone'
],

function(app, Backbone) {
	var Views = {};

	// Contact Event will keep the views updated of the currently
	// displayed contact
	// It will trigger the "modelset" event when the model is changed
	var contactEvent = {
		model: null,
		
		//This function takes in an instance of <Contact.Model>
		setModel: function(model) {
			this.model = model;
			this.trigger('modelset', this.model);
		},
		getContactId: function() {
			return contactEvent.model.get('id');
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
		// Provide attributes for the template
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

			// Listen for modification of the contact model
			contactEvent.on('modelset', function() {
				if(_.isNull(contactEvent.model) ||
						!_.isUndefined(contactEvent.model)){
          clearInterval(this.intervalSync);
				}
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
			// console.log('start edit');
			this.$el.addClass('editing');
		},
		finishEdit: function() {
			// Get the attributes
			var attr = this.updatedAttributes();
			this.$('.save-item').popover('destroy');

			// Verify validation
			if(!this.model.set(attr)) {
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
			// console.log('remove item');
			this.model.destroy();
		}
	});


	Views.List = Backbone.View.extend({
		tagName: 'ul',
		beforeRender: function() {
			this.collection.each(function(item) {
				this.insertView(new Views.Item({
					model: item
				}));
			}, this);
		},
		initialize: function() {
			// Style of the list
      this.$el.addClass('unstyled');

			// Listen for new models
			this.collection.on('add', function(item) {
				this.insertView(new Views.Item({
					model: item
				})).render();
			}, this);

			// Listen for delete models
			this.collection.on('remove', function(item) {
				this.getView(function(view) {
					return view.model === item;
				}).remove();
			}, this);

			// Listen for modification of the contact model
			contactEvent.on('modelset', function() {
				if(!_.isNull(contactEvent.model)&&
						!_.isUndefined(contactEvent.model)){

					this.collection.url = app.root
						+ 'server/index.php/contacts/'
						+ contactEvent.model.get('id')
						+ '/phones/';
					this.collection.fetch();
				} else {
					this.collection.reset();
				}
			}, this);
			
			// Listen for reset of the collection
			this.collection.on('reset', function() {
				this.render();
			}, this);

			// Keep the phone entry list up to date
			setInterval(_.bind(function() {
				if(!_.isNull(contactEvent.model)&&
						!_.isUndefined(contactEvent.model)){
					this.collection.fetch({add: true});
				}
			}, this), 10000);
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
				contact_id: contactEvent.getContactId()
			};
		},
		toggleSubmit: function() {
      var model = new this.collection.model(this.newAttributes());

			// Validation
			this.$('#new-phone-submit').popover('destroy');
			if(!model.isValid(['number', 'type'])){
				this.$('#new-phone-submit').popover({
					animation: 'show',
					placement: 'bottom',
					title: 'Error',
					content: function() {
						return _.reduce(model.validate(), function(m, n) {
							return (_.isNull(m) ? '' : m + '<br/><br/>') + n;
						}, null);
					}
				});
				this.$('#new-phone-submit').popover('show');
			} else {
				model.save();
				this.collection.add(model);
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
		},
		initialize: function() {
			// Listen if there is a model
			contactEvent.on('modelset', function() {
				this.$('#new-phone-submit').popover('destroy');
				this.render();
			}, this);
		},
		afterRender: function() {
			if (_.isUndefined(contactEvent.model) ||
					_.isNull(contactEvent.model)){
				this.$el.empty();
			}
		}
	});

	return {
		Views: Views,
		setContactModel: contactEvent.setModel,
		getContactId: contactEvent.getContactId
	};
});
