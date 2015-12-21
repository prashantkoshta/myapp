/**
 * New node file
 */
var express = require('express');
var router = express.Router();
var AppRule = require('../config/apprule-engine');
var adminpanelfactory  = require('../controller/admincontrolpanel');
var ReqJsonValidator = require('../src/validator/request-json-validator');
var AppServiceAccessValidator  = require('../src/validator/service-access-validator');
/* GET users listing. */
router.get('/admindashboard', AppRule.validateToken, AppServiceAccessValidator.validateServiceAccess,  function(req, res) {
	adminpanelfactory.getCollectionList(req,res,function(a,b){});
	res.render('private/admindashboard.ejs',{
		arRole : req.user.role // get the user out of session and pass to template
	});
});
module.exports = router;