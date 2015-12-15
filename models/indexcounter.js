// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var crypto   = require('crypto');
// define the schema for our user model
var indexcounter = mongoose.Schema({
	_id : String,
	seq : Number,
	prefix : String
});
module.exports = mongoose.model('IndexCounter', indexcounter);