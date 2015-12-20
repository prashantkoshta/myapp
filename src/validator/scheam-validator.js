'use strict';
var Validator = require('jsonschema').Validator;
var v = new Validator();
var AppJSONValidator = function(){};


//{"projectname" : "New Test xxxx2"}	
var projectBuildsSchema = {
  "id": "/projectBuilds",
  properties: {
	projectname: { 
		type: 'string' // ,pattern : "^([a-z0-9]{5,})$"
	}
  },
  additionalProperties: false,
  required: ['projectname']
};

/*
{
"projectname" : "New Test 1",
"git" : {
  "url" : "https://github.com/codepath/android_hello_world",
  "username" : "prashantkoshta@gmail.com",
  "password" : "mmmm"
},
"buildbatchfile" : "gradlew.bat",
"buildlocation" : "/android_hello_world.apk",
"status" : "Active",
"created_user_id" : "565554dfd34c84b43a728b15",
"created_userfullname" : "pra Kos"
}
*/
var gitSchema = {
	"id": "/gitSchema",
	"type": "object",
	properties: {
		url : {type: 'string'},
		username : {type: 'string'},
		password : {type: 'string'}
	},
	additionalProperties: false,
	required: ['url','username','password']
}

var createProjectSchema = {
	"id": "/projectSchema",
	"type": "object",
	properties: {
				projectname : {type: 'string'},
				git : {"$ref": "/gitSchema"},
				buildbatchfile : {type: 'string'},
				buildlocation : {type: 'string'},
				status : {"enum": [ "Active" ] }	  
	},
	additionalProperties: false,
	required: ['projectname','git','buildbatchfile','buildlocation','status']
};



// Delete build
/*{
    "projectname":"Test 1",
    "builds" : ["5661227c1013f4bc2702f3ba"]
}*/
var deleteBuildSchema = {
	"id": "/deleteBuildSchema",
	"type": "object",
	properties: {
				projectname : {type: 'string'},
				builds : {type: 'array'},
	},
	additionalProperties: false,
	required: ['projectname','builds']
};

var userProjctRoleInfoSchema = {
	"id": "/userProjctRoleInfoSchema",
	"type": "object",
	properties: {
				_id : {type: 'string'},
				projects : {type: 'array'},
				role : {
					type : 'array', 
					"items": [{
						"type" : "string",
						"enum" : ["admin", "user"]
					},
					{
						"type" : "string",
						"enum" : ["user"]
					}],
					"minItems": 1,
					"maxItems": 2},
				},
	additionalProperties: false,
	required: ['_id','projects','role']
}


var schemaMap = {
	"projectBuildsSchema" : projectBuildsSchema,
	"createProjectSchema" : createProjectSchema,
	"deleteBuildSchema" : deleteBuildSchema,
	"userProjctRoleInfoSchema" : userProjctRoleInfoSchema
};
v.addSchema(gitSchema, '/gitSchema');



AppJSONValidator.prototype.validateInputJSON = function(schemaType,inputJson) {
	var results = v.validate(inputJson,schemaMap[schemaType]);
	//console.log(results);
	return results;
};
/*
var t = new AppJSONValidator().validateInputJSON("deleteBuildSchema",{
"projectname" : "New Test 1",
"builds" : ["sadfsdafdsa"],
});*/
module.exports = new AppJSONValidator();