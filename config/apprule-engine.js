/**
 * Error Code for application
 */
'use strict';
var AppRule = function(){ };

AppRule.prototype.canAccessService = function(req, res, next) {
	var arRole = req.user.role;
	var access = true;
	if(arRole.indexOf("user") > -1 && req.url === "/saveBuildInfo"){
		access = false;
	}
    if (access)
        return next();
    res.render('error');
    res.end();
}

AppRule.prototype.canAccessServiceOnlyAdmin = function(req, res, next) {
	var arRole = req.user.role;
	var access = true;
	if(arRole.indexOf("admin") > -1 && req.url === "/saveBuildInfo"){
		access = false;
	}
    if (access)
        return next();
    res.render('error');
    res.end();
}

AppRule.prototype.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
    res.end();
}
module.exports = new AppRule();