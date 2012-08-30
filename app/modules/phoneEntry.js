define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {

  // Create a new module.
  var PhoneEntry = app.module();

  // Default model.
  PhoneEntry.Model = Backbone.Model.extend({
  
  });

  // Default collection.
  PhoneEntry.Collection = Backbone.Collection.extend({
    model: PhoneEntry.Model
  });

  // Return the module for AMD compliance.
  return PhoneEntry;

});
