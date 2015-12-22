'use strict';
var AppServiceAccessValidator = function(){ };
var service = require('../../models/service');
AppServiceAccessValidator.prototype.validateServiceAccess = function(req, res, next) {
	var role = req.user.role;
	var servicename = req.baseUrl+req.route.path;
	//db.services.find({role:'user'},{_id:0,services:{$elemMatch : {"servicename":'/buildapp/gateway/updateProjectAndRoleInfoByUserId',block:1}}});
	service.findOne({"role":role},{_id:0,services:{$elemMatch : {"servicename":servicename,block:0}}},function(err, srv) {
		if(err)throw err;
		if(srv.services.length === 0){
			res.json({ 'error': true, 'errorType': "Service autherrization failed.", "data": null});
		}else{
			next();
		}
	});	
};
module.exports = new AppServiceAccessValidator();