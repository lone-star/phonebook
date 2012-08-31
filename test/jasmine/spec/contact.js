describe('Contact', function() {
	describe('Form View', function() {
		it('can add a model to a collection', function() {
			var semaphore = 1;

			require([
			'modules/contact'
			],

			function(Contact) {
				var col, form, main;

				//Create the list and the form
				col = new Contact.Collection();
				form = new Contact.Views.Form({
					collection: col
				});
				
				//create and render the layout
				main = new Backbone.Layout();
				main.setView('.form', form);
				main.render();
				
				//render the form
				form.render(function() {
					//set form data and submit
					form.$('#new-contact-first_name').val('Michael');
					form.$('#new-contact-last_name').val('Phelips');
					form.$('#new-contact-submit').trigger('click');

					//check results
					expect(col.length)
						.toBe(1);
					expect(col.at(0).get('first_name'))
						.toBe('Michael');
					expect(col.at(0).get('last_name'))
						.toBe('Phelips');

					//verify form
					expect(form.$('#new-contact-first_name').val())
						.toBe('');
					expect(form.$('#new-contact-last_name').val())
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
			'modules/contact'
			],

			function(Contact) {
				var list, col, item;

				//Create the list and the colleciton
				col = new Contact.Collection();
				list = new Contact.Views.List({
					collection: col
				});

				//Create and render the layout
				main = new Backbone.Layout();
				main.setView('.list', list);
				main.render();

				list.render(function() {
					col.add(new Contact.Model({
						first_name: 'Michael',
						last_name: 'Phelips'
					}));

					//Check result
					expect(list.getViews().size().value())
						.toBe(1);
					
					item = list.getViews().toArray().first().value();
					expect(item.model.get('first_name'))
						.toBe('Michael');
					expect(item.model.get('last_name'))
						.toBe('Phelips');

					semaphore --;
				});
			});
			waitsFor(function() { return semaphore === 0 });
		});


		it('can remove an item when a model is removed from the collection',
				function() {

			var semaphore = 1;
			require([
			'modules/contact'
			],

			function(Contact) {
				var list, col, item, model;

				//Create a new collection and add a model
				col = new Contact.Collection();
				model =  new Contact.Model({
					first_name: 'Michael',
					last_name: 'Phelips'
				});
				col.add(model);

				//create the list
				list = new Contact.Views.List({
					collection: col
				});

				//Create and render the layout
				main = new Backbone.Layout();
				main.setView('.list', list);
				main.render();

				list.render(function() {
					col.remove(model);

					//Check Result
					// The number of elements containing the string Michael
					expect(list.$el.find('*:contains("Michael")').size())
						.toBe(0);
					//the number of elements containing the string Phelips
					expect(list.$el.find('*:contains("Phelips")').size())
						.toBe(0);

					semaphore --;
				});
			});
			waitsFor(function() {return semaphore === 0});
		});
	});
			


	describe('Item', function() {
		var main;

		afterEach(function() {
			main = null;
		});

		it('can be updated when a model is updated', function() {
			var semaphore = 1;
			require([
			'modules/contact'
			],

			function(Contact) {
				var model, item;

				//Create a model
				model = new Contact.Model({
					first_name: 'Michael',
					last_name: 'Phelips'
				});

				//Create an item
				item = new Contact.Views.Item({
					model: model
				});

				//Create and render the layout
				main = new Backbone.Layout();
				main.setView('.item', item);
				main.render();

				item.render(function() {
					model.set('first_name', 'Felix');

					//Check Result
					expect(item.$('.contact-item-first_name').text())
						.toBe('Felix');

					semaphore --;
				});

			});
			waitsFor(function() { return semaphore === 0});
		});


		it('can update a model', function() {
			var semaphore = 1;
			require([
			'modules/contact'
			],

			function(Contact) {
				var model, item;

				//Create a model
				model = new Contact.Model({
					fisrt_name: 'Michael',
					last_name: 'Phelips'
				});

				//Create an item
				item = new Contact.Views.Item({
					model: model
				});

				//Create and render the layout
				main = new Backbone.Layout();
				main.setView('.item', item);
				main.render();

				item.render(function() {
					//modify the model
					item.$('.edit-item').trigger('click');
					item.$('.first_name-input').val('Felix');
					item.$('.last_name-input').val('Lechat');
					item.$('.save-item').trigger('click');

					//Check result
					expect(model.get('first_name'))
						.toBe('Felix');
					expect(model.get('last_name'))
						.toBe('Lechat');

					semaphore --;
				});
			});
			waitsFor(function() {return semaphore === 0});
		});


		it('can delete a model', function() {
			var semaphore = 1;
			require([
			'modules/contact'
			],

			function(Contact) {
				var model, item, col;
				
				//Create a model
				model = new Contact.Model({
					fisrt_name: 'Michael',
					last_name: 'Phelips'
				});

				//Add the model inside a collection
				col = new Contact.Collection();
				col.add(model);

				//Create an item
				item = new Contact.Views.Item({
					model: model
				});

				//Create and render the layout
				main = new Backbone.Layout();
				main.setView('.item', item);
				main.render();

				item.render(function() {
					//delete the model
					item.$('.remove-item').trigger('click');

					//Check result
					expect(col.length)
						.toBe(0);
						
					semaphore --;
				});
			});
			waitsFor(function() {return semaphore === 0});
		});
	});
});
