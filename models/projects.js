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
	created_user_id : String,
	created_userfullname : String,
	builds : [{
		builddate : Date,
		buildname : String,
		ostype : String,
		appversion : String,
		buildnum : String,
		filename : String,
		createdby : String,
		description : String,
		build_user_id: String,
		build_userfullname: String
	}]
});
// Status can be active, unactive
// create the model for users and expose it to our app
module.exports = mongoose.model('Projects', projectsSchema);