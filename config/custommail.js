var nodemailer 		= require('nodemailer');
var fs 				= require('fs');
var ejs 			= require('ejs');
var config 			= require('./config');
var CustomMail = function (to, subject, template, content){
	this.to = to;
	this.subject = subject;
	this.template = template;
	this.content = content;
};

var smtpTransport = nodemailer.createTransport("SMTP", {
	service: "Gmail",
	auth: {
		user: config.sendMail,
		pass: config.sendMailAuth
	}
});

CustomMail.prototype.send = function (callback){
	//Get email template path
	var template = process.cwd() + '/mailtemplates/templates/' +this.template+'.ejs';
	var content = this.content;
	var to = this.to;
	var subject = this.subject;

	// Use fileSystem module to read template file
	fs.readFile(template, 'utf8', function (err, file){
		if(err) return callback (err);
		var html = ejs.render(file, content);
		//ejs.render(file, content); returns a string that will set in mailOptions
		var mailOptions = {
			from: config.sendMail,
			to: to,
			subject: subject,
			html: html
		};
		smtpTransport.sendMail(mailOptions, function (err, info){
			// If a problem occurs, return callback with the error
			if(err) return callback(err);
			callback();
		});
	});
};
//We export our custom module 
module.exports = CustomMail;