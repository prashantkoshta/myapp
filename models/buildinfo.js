// app/models/userinfo.js
// load the things we need
var mongoose = require('mongoose');
// define the schema for our user model
var buildinfoSchema = mongoose.Schema({
	builddate : Date,
	buildname : String,
	ostype : String,
	appversion : String,
	buildnum : String,
	filename : String,
	createdby : String,
	description : String,
	projectname : String
});
// create the model for users and expose it to our app
module.exports = mongoose.model('buildinfo', buildinfoSchema);