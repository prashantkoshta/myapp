var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var roleSchema = mongoose.Schema({
	"_id" : Number,
	"role" : String,
	"access" : Number
});
module.exports = mongoose.model('Role', roleSchema);