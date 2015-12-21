var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var serviceSchema = mongoose.Schema({
	"_id" : Number,
	"role" : String,
	"services" : [{
		servicename : String
	}]
});
module.exports = mongoose.model('Service', serviceSchema);