var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var batchSchema = mongoose.Schema({
	"_id" : Number,
	"buildtype" : String,
	"batchfile" : String,
	'filematch' : String
});
module.exports = mongoose.model('batch', batchSchema);