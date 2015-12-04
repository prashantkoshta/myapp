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
};

ProjectFactory.prototype.createProject = function(req,res,callback){
      var newProjectDocument = new ProjectDocument();
      newProjectDocument.projectname ="TEmp";
      newProjectDocument.git = {
        "url" : "test",
        "username" : "",
        "password" : ""
      }
  		newProjectDocument.save(function(err, obj) {
  			if(err){
                  throw err;
  			}
  			return callback(true,"",obj);
  		});

};

module.exports = ProjectFactory;
