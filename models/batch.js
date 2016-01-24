var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var batchSchema = mongoose.Schema({
	"_id" : Number,
	"buildtype" : String,
	'desc' : String,
	"batchfile" : String
});
module.exports = mongoose.model('batch', batchSchema);