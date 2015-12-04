// load up the user model
var ProjectDocument = require('../models/projects');
var ProjectFactory = function();

ProjectFactory.prototype.getProjectList = function(req,res,callback){
  		ProjectDocument.find(function(err, list) {
  			if(err){
                  throw err;
  			}
  			if(!list) {
  			    return callback(false,null);  
  			}
  			return callback(true,"",list);
  		}).sort({'projectname': -1});
}




module.exports = ProjectFactory;
