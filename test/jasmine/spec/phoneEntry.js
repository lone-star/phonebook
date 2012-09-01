describe('Phone Entry', function() {
	// The contact containing the phone entries.
	var mainContact;

	beforeEach(function() {
		var semaphore = 1;
		
		require([
    'modules/contact'
		],

		function(Contact) {
			//initialize the contact
			mainContact = new Contact.Model({
				id: 1,
				first_name: 'Michael',
				last_name: 'Phelips'
			});
			mainContact.id = 1;
			semaphore --;
		});
		waitsFor(function() { return semaphore === 0 });
	});


	describe('Form View', function() {
		it('can add a model to a collection', function() {
			var semaphore = 1;

			require([
			'modules/phoneEntry'
			],

			function(PhoneEntry) {
				var col, form, main, model;

				//Set the contact Model
				PhoneEntry.setContactModel(mainContact);

				//Create the list and the form
				col = new PhoneEntry.Collection();
				form = new PhoneEntry.Views.Form({
					collection: col
				});

				//Create and render the layout
				main = new Backbone.Layout();
				main.setView('.form', form);
				main.render();

				//render the form
				form.render(function() {
					//set form data and submit
					form.$('#new-phone-number').val('123456789');
					form.$('option:selected').prop('selected', false);
					form.$('option[value="home"]').prop('selected', true);
					form.$('#new-phone-submit').trigger('click');

					//Check result
					expect(col.length)
						.toBe(1);
					expect(col.at(0).get('number'))
						.toBe('123456789');
					expect(col.at(0).get('type'))
						.toBe('home');
					
					//verify form
					expect(form.$('#new-phone-number').val())
						.toBe('');
					
					semaphore --;
				});
			});
			waitsFor(function() { return semaphore === 0 });
		});
		//TODO: make test with validators
	});


	describe('List View', function() {
		var main;

		afterEach(function() {
			main = null;
		});

		it('can add a new item when a model is added to the collection',
				function() {

			var semaphore = 1;

			require([
			'modules/phoneEntry'
			],

			function(PhoneEntry) {
				var list, col, item;

				PhoneEntry.setContactModel(mainContact);

				//Create the list and the collection
				col = new PhoneEntry.Collection();
				list = new PhoneEntry.Views.List({
					collection: col
				});

				//Create and render the layout
				main = new Backbone.Layout();
				main.setView('.list', list);
				main.render();

				list.render(function() {
					col.add(new PhoneEntry.Model({
						number: '123456789',
						type: 'home'
					}));

					//Check result
					expect(list.getViews().size().value())
						.toBe(1);

					item = list.getViews().toArray().first().value();
					expect(item.model.get('number'))
						.toBe('123456789');
					expect(item.model.get('type'))
						.toBe('home');

					semaphore --;
				});
			});
			waitsFor(function() { return semaphore === 0 });
		});
		it('can remove an item when a model is removec from the collection',
				function() {
			
			var semaphore = 1;

			require([
			'modules/phoneEntry'
			],

			function(PhoneEntry) {
				var list, col, item, model;

				PhoneEntry.setContactModel(mainContact);

				//Create the list and the collection and add a model
				col = new PhoneEntry.Collection();
				list = new PhoneEntry.Views.List({
					collection: col
				});
				model = new PhoneEntry.Model({
					number: '123456789',
					type: 'home'
				});
				col.add(model);

				//Create and render the layout
				main = new Backbone.Layout();
				main.setView('.list', list);
				main.render();

				list.render(function() {
					col.remove(model);

					//check the result
					// The number of elements containing the phone number
					expect(list.$el.find('*:contains("123456789")').size())
						.toBe(0);
					// The number of elements containing the type
					expect(list.$el.find('*:contains("home")').size())
						.toBe(0);

					semaphore --;
				});
			});
			waitsFor(function() {return semaphore === 0});
		});
	});


	describe('Item View', function() {
		var main;

		afterEach(function() {
			main = null;
		});

		it('can be updated when a model is updated', function() {
			var semaphore = 1;

			require([
			'modules/phoneEntry'
			],

			function(PhoneEntry) {
				var model, item;

				PhoneEntry.setContactModel(mainContact);

				// Create a model and an item
				model = new PhoneEntry.Model({
					number: '123456789',
					type: 'home'
				});
				item = new PhoneEntry.Views.Item({
					model: model
				});

				main = new Backbone.Layout();
				main.setView('.item', item);
				main.render();

				item.render(function() {
					model.set('number', '987654321');

					//check result
					expect(item.$('.phone-item-number').text())
						.toBe('987654321');
					
					semaphore --;
				});
			});
			waitsFor(function() { return semaphore === 0});
		});
		it('can update a model', function() {
			var semaphore = 1;

			require([
			'modules/phoneEntry'
			],

			function(PhoneEntry) {
				var model, item;

				PhoneEntry.setContactModel(mainContact);

				//Create a model and an item
				model = new PhoneEntry.Model({
					number: '123456789',
					type: 'home'
				});
				item = new PhoneEntry.Views.Item({
					model: model
				});

				//Create and render the layout
				main = new Backbone.Layout();
				main.setView('.item', item);
				main.render();

				item.render(function() {
					item.$('.edit-item').trigger('click');
					item.$('.number-input').val('987654321');

					//change selection
					item.$('option:selected').prop('selected', false);
					item.$('option[value="work"]').prop('selected', true);

					item.$('.save-item').trigger('click');

					// change result
					expect(model.get('number'))
						.toBe('987654321');
					
					expect(model.get('type'))
						.toBe('work');

					semaphore --;
				});
			});
			waitsFor(function() {return semaphore === 0});
		});


		it('can delete a model', function() {
			var semaphore = 1;

			require([
			'modules/phoneEntry'
			],

			function(PhoneEntry) {
				var model, item, col;

				PhoneEntry.setContactModel(mainContact);

				//Create the model and add to collection
				model = new PhoneEntry.Model({
					number: '123456789',
					type: 'home'
				});
				col = new PhoneEntry.Collection();
				col.add(model);

				//Create an item
				item = new PhoneEntry.Views.Item({
					model: model
				});

				//create and render the layout
				main = new Backbone.Layout();
				main.setView('.item', item);
				main.render();

				item.render(function() {
					//delete the model
					item.$('.remove-item').trigger('click');

					//check result
					expect(col.length)
						.toBe(0);
					
					semaphore --;
				});
			});
			waitsFor(function() {return semaphore === 0});
		});
	});

	describe('Phone Entry Relation', function(){
		it('will keep the phone entry module updated when the contact model is changed',
				function() {

			var semaphore = 1;

			require([
			'modules/phoneEntry',
			'modules/contact'
			],

			function(PhoneEntry, Contact) {
        var list, col, model;

				PhoneEntry.setContactModel(mainContact);

				//Create the collection and the list
				col = new PhoneEntry.Collection();
				col.add(new PhoneEntry.Model({
					number: '123456789',
					type: 'home'
				}));
				list = new PhoneEntry.Views.List({
					collection: col
				});

				//Create a model
				model = new Contact.Model({
					id: -1,
					first_name: 'Felix',
					last_name: 'Lechat'
				});

				//create and render the layout
				main = new Backbone.Layout();
				main.setView('.list', list);
				main.render();

				list.render(function() {

					//Update the contact model
					PhoneEntry.setContactModel(model);
					
					//Wait for events to finish
					col.on('reset', function() {

						//Check result
						// The number of elements containing the phone number
						expect(list.$el.find('*:contains("123456789")').size())
							.toBe(0);
						// The number of elements containing the type
						expect(list.$el.find('*:contains("home")').size())
							.toBe(0);
						expect(col.length)
							.toBe(0);

						//the url of a new model corresponds to the model
						expect(model.url() + model.id + '/phones/')
							.toBe((new PhoneEntry.Model({
								number: '987654321',
								type: 'work'
							})).url());
						
						//remove callback
						col.off();
						semaphore --;
					});
				});
			});
			waitsFor(function() {return semaphore === 0});
		});
	});
});
