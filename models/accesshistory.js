var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var accesshistorySchema = mongoose.Schema({
	"_id" : String,
	"projectid" : String,
	"projectname" : String,
	"created_userfullname" : String,
	'active' : Number,
	"requserid":String,
	"reqfullname": String,
	"role": String,
	"status" : String,
	"reqdate" : Date
});
module.exports = mongoose.model('AccessHistory', accesshistorySchema);