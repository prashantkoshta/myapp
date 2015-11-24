var nodemailer 		= require("nodemailer");
var config 			= require('./config');
module.exports = {
	sendEmailTo : function(){
        // create reusable transport method (opens pool of SMTP connections)
        var smtpTransport = nodemailer.createTransport("SMTP", {
            service: "Gmail",
            auth: {
                user: config.sendMail,
                pass: config.sendMailAuth
            }
        });

        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: config.sendMail, // sender address
            to: "", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world ✔", // plaintext body
            html: "<b>Hello world ✔</b>" // html body
        }
        // send mail with defined transport object
        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                console.log("Message sent: " + response.message);
            }
			smtpTransport.close();
    // if you don't want to use this transport object anymore, uncomment following line
    //smtpTransport.close(); // shut down the connection pool, no more messages
        });
    }
};