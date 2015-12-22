// load up the user model
var mongoose = require('mongoose');
module.exports = (function() {
	function getCollectionList(req,res,callback){
		mongoose.connection.db.collectionNames(function(err, result) {
			if(err){
                throw err;
			}
			if(!buildlist) {
			    return callback(false,null);  
			}
			return callback(true,result);
		});
	}
	
	return({
		getCollectionList : getCollectionList
	});
})();