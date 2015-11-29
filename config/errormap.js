/**
 * Error Code for application
 */
'use strict';
var errors = {
	//
	"0001" : "Check box should be selected.",
	"0002" : "Emailid already exist.",
	"0003" : "No user found.",
	"0004" : "Oops! Wrong password."
}
var AppError = function(){ };
AppError.prototype.getError = function(code){
	return errors[code]; 
};
module.exports = new AppError();