// app/models/project.js
// load the things we need
var mongoose = require('mongoose');
// define the schema for our user model
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
var projectsSchema = mongoose.Schema({
	_id : String,
	projectname : String,
	buildbatchfile : String,
	buildlocation : String,
	buildtype : String,
	status : String,
	created_user_id : String,
	created_userfullname : String,
	active : Number,
	git : {
	  url : String,
	  username : String,
	  password : String
	},
	svn : {
	  url : String,
	  username : String,
	  password : String
	},
	projectteam : [{
		"_id": String,
		"userid" : String,
		"fullname" : String,
		"allocationdate" : Date,
		"projectrole" : String,
		'active' : Number
	}],
	builds : [{
		_id : String,
		builddate : Date,
		buildname : String,
		ostype : String,
		appversion : String,
		buildnum : String,
		filename : String,
		createdby : String,
		description : String,
		build_user_id: String,
		build_userfullname: String,
		active : Number
	}]
});
// Status can be active, unactive
// create the model for users and expose it to our app
module.exports = mongoose.model('Projects', projectsSchema);