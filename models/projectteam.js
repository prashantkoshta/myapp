var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var projectteamSchema = mongoose.Schema({
	"userid" : String,
	"fullname" : String,
	"allocationdate" : String,
	"projectrole" : String,
	'active' : Number
});
module.exports = mongoose.model('ProjectTeam', projectteamSchema);