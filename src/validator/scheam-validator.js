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
		url : {
			type: 'string',
			"pattern" : /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/
		},
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

var editProjectSchema = {
	"id": "/editprojectSchema",
	"type": "object",
	properties: {
				_id : {type: 'string'},
				git : {"$ref": "/gitSchema"},
				buildbatchfile : {type: 'string'},
				buildlocation : {type: 'string'},
				status : {"enum": [ "Active" ] }	  
	},
	additionalProperties: false,
	required: ['_id','git','buildbatchfile','buildlocation','status']
};

var saveAutoBuildSchema = {
	"id": "/saveAutoBuildSchema",
	"type": "object",
	properties: {
				builddumpid : {type: 'string'},
				name : {type: 'string'},
				description : {type: 'string'},
				appversion : {type: 'string'},
				buildversion : {type: 'string'}	  
	},
	additionalProperties: false,
	required: ['builddumpid','name','description','appversion','buildversion']
}


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
				builds : {type: 'array',"uniqueItems": true},
	},
	additionalProperties: false,
	required: ['projectname','builds']
};

var userProjctRoleInfoSchema = {
	"id": "/userProjctRoleInfoSchema",
	"type": "object",
	properties: {
				_id : {type: 'string'},
				projects : {type: 'array',"uniqueItems": true},
				role : {
						"type" : "string",
						"enum" : ["admin", "user"]
					},
				},
	additionalProperties: false,
	required: ['_id','projects','role']
};


var changepasswordSchema = {
	"id": "/changepasswordSchema",
	"type": "object",
	properties: {
				oPwd : {type: 'string'},
				nPwd : {type: 'string'}
				},
	additionalProperties: false,
	required: ['oPwd','nPwd']
};

var schemaMap = {
	"projectBuildsSchema" : projectBuildsSchema,
	"createProjectSchema" : createProjectSchema,
	"deleteBuildSchema" : deleteBuildSchema,
	"userProjctRoleInfoSchema" : userProjctRoleInfoSchema,
	"changepasswordSchema" : changepasswordSchema,
	"publishBuildInfoSchema" : deleteBuildSchema,
	"editProjectSchema" : editProjectSchema,
	"saveAutoBuildSchema" : saveAutoBuildSchema
};
v.addSchema(gitSchema, '/gitSchema');



AppJSONValidator.prototype.validateInputJSON = function(schemaType,inputJson) {
	var results = v.validate(inputJson,schemaMap[schemaType]);
	return results;
};


/*
var t = new AppJSONValidator().validateInputJSON("deleteBuildSchema",{
"projectname" : "New Test 1",
"builds" : ["sadfsdafdsa"],
});*/
module.exports = new AppJSONValidator();