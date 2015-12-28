// app/models/userinfo.js
// load the things we need
var mongoose = require('mongoose');
// define the schema for our user model
var builddumpSchema = mongoose.Schema({
		_id : String,
		build_user_id: String,
		isSave : Number,
		relativepath : String,
		clonefolder : String,
		projectid : String,
		projectname : String,
		filename : String
});
// create the model for users and expose it to our app
module.exports = mongoose.model('builddump', builddumpSchema);