var async            	= require('async');
var indexcounter        = require('../models/indexcounter');
var genrateIndexKey = function(){ };
genrateIndexKey.prototype.genrateNewIndexId = function(name,done) {
	async.waterfall([
					function(callback){
						indexcounter.findOneAndUpdate({ _id: name },{ $inc: { seq: 1 } ,prefix : name+"_"},{ upsert: true },function(err,result){
						  if(err) throw err;
						  callback(null,result);
					   }); 
					},
					function(arg1,callback){
						indexcounter.findOne({_id:name},function(err1,result1){
							  if(err1) throw e;
							  callback(null,result1.prefix+result1.seq);
						});
					}
			   ],function(err,_id){
						return done(_id);
				});	
}
module.exports = new genrateIndexKey();