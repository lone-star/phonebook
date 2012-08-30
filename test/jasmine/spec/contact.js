describe('Form View', function() {
	it('can add a model to a collection', function() {
		var semaphore = 1;

		require([
		'modules/contact'
		],

		function(Contact) {
			var list, form;

			//Create the list and the form
			list = new Contact.Collection;
			form = new Contact.Views.Form({
				collection: list
			}).render();

			//set form data and submit
			form.$('#new-contact-first_name').val('Michael');
			form.$('#new-contact-last_name').val('Phelips');
			form.$('#new-contact-submit').trigger('click');

			//check results
//			setTimeout(function() {
				
				
				//verify collection
				expect(list.length)
					.toBe(1);
				expect(list.at(0).get('first_name'))
					.toBe('Michael');
				expect(list.at(0).get('last_name'))
					.toBe('Phelips');

				//verify form
				expect(form.$('#new-contact-first_name').val())
					.toBe('');
				expect(form.$('#new-contact-last_name').val())
					.toBe('');

				semaphore --;

//			}, 500);
		});
		waitsFor(function() { return semaphore === 0 }); 
	});
});



describe('Form List', function() {
	it('can add a new item when a model is added to the collection',
			function() {

		var semaphore = 1;
		require([
		'module/contact'
		],

		function(Contact) {
			var list, col, item;

			//Create the list and the colleciton
			col = new Contact.Collection();
			list = new Contact.Views.List({
				collection: col
			}).render();

			col.add(new Contact.Model({
				first_name: 'Michael',
				last_name: 'Phelips'
			}));

			//Check result
			expect(col.getViews().size())
				.toBe(1);
			
			item = col.getViews().toArray().first();
			expect(item.model.get('first_name'))
				.toBe('Michael');
			expect(item.model.get('last_name'))
				.toBe('Phelips');

			semaphore --;
			
		});
		waitsFor(function() { return semaphore === 0 });
	});


	it('can remove an item when a model is removed from the collection',
			function() {

		var semaphore = 1;
		require([
		'module/contact'
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
			}).render();

      col.remove(model);

			//Check Result
			expect(list.getView().size())
				.toBe(0);

			semaphore --;

		});
		waitsFor(function() {return semaphore === 0});
	});
});
		


describe('Item', function() {
	it('can be updated when a model is updated', function() {
		var semaphore = 1;
		require([
		'module/contact'
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

			model.set('first_name', 'Felix');

			//Check Result
			expect(item.$('contact-item-first_name').val())
				.toBe('Felix');

			semaphore --;
		});
		waitsFor(function() { return semaphore === 0});
	});


	it('can update a model', function() {
		var semaphore = 1;
		require([
		'module/contact'
		],

		function(Contact) {
			var model, item;

			//Create a model
			model = new Contact.Model({
				fisrt_name: 'Michael',
				last_name: 'Phelips'
			});

			//Create an item
			item = new Concat.Views.Item({
				model: model
			});

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
		waitsFor(function() {return semaphore === 0});
	});


	it('can delete a model', function() {
		var semaphore = 1;
		require([
		'module/contact'
		],

		function(Contact) {
			var model, item;
			
			//Create a model
			model = new Contact.Model({
				fisrt_name: 'Michael',
				last_name: 'Phelips'
			});

			//Create an item
			item = new Concat.Views.Item({
				model: model
			});

			//delete the model
			item.$('.remove-item').trigger('click');

			//check the result
			expect(model.has('first_name'))
				.toBe(false);
			expect(model.has('last_name'))
				.toBe(false);
				
			semaphore --;
		});
		waitsFor(function() {return semaphore === 0});
	});
});
