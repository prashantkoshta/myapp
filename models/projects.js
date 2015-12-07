// app/models/project.js
// load the things we need
var mongoose = require('mongoose');
// define the schema for our user model
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var projectsSchema = mongoose.Schema({
	projectname : String,
	git : {
	  url : String,
	  username : String,
	  password : String
	},
	buildbatchfile : String,
	buildlocation : String,
	status : String,
	users : [Schema.Types.ObjectId],
	builds : [Schema.Types.ObjectId]
});
// Status can be active, unactive
// create the model for users and expose it to our app
module.exports = mongoose.model('Projects', projectsSchema);