// app/models/project.js
// load the things we need
var mongoose = require('mongoose');
// define the schema for our user model
var projectSchema = mongoose.Schema({
	projectname : String,
	git : {
	  url : String,
	  username : String,
	  password : String
	},
	status : String
});
// Status can be active, unactive
// create the model for users and expose it to our app
module.exports = mongoose.model('projectDocuemnt', projectSchema);
