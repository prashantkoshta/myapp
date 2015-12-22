// load up the user model
var User            = require('../models/user');
var mail 			= require('../config/mail');
var CustomMail 		= require('../config/custommail');
var config 			= require('../config/config');
var url 			= require('url');

module.exports = (function() {
	function getAllUsers(req,res){
		User.find(function(err, users) {
			if (err)
				return -1;
			res.render('admin.ejs',{result:users});
		});
	}

	function getRandomPwd(n, a) {
	  var index = (Math.random() * (a.length - 1)).toFixed(0);
	  return n > 0 ? a[index] + getRandomPwd(n - 1, a) : '';
	}

	function getLoginUrl(req) {
	   return config.baseURLPath+"/#/loginview";
	}
	
	function isEmailExist(email,callback){
		  User.findOne({'local.email' : email }, function (err, user) {
			    if (err)
                    throw err;
				if (!user) {
				    return callback(false);
				   
				}
				return callback(true);
		  });
	}
	
	function resetPassword(aEmail,req,callback){
		User.findOne({'local.email' : aEmail }, function (err, user) {
			    if (err)
                    throw err;
				if (!user) {
				   return callback(false,user);;
				}
				var password = getRandomPwd(5,'qwertyuiopasdfg@!hjklzxcv#%bnmQWERTYUIO$PASDFGHJKLZXCVBNM12345*?67890');
				var newUser = new User();
				var encryptedPwd = newUser.generatePassword( user.local.hash,password); 
				User.update({"local.email": aEmail}, {"$set": {"local.password" : encryptedPwd}}, { upsert: false},function (err, result) {
					if (err)
						throw err;
					
					var data = {
					member: {
						email: user.local.email,
						firstName: user.local.firstname,
						lastName: user.local.lastname,
						password: password
						},
						appName: 'MY INFO',
						pageUrl: getLoginUrl(req)
					};
					var customMail = new CustomMail(data.member.email, 'Your password changed : '+data.appName, 'forgotpwdmail', data);
					customMail.send(function (err){console.error("Error :",err);})
					return callback(true,user);
				});
				
				
		});
		
	}
	
	function changePassword(id,oPassword,nPassword,callback){
		User.findOne({'_id' : id}, function (err, user) {
			    if (err)
                    throw err;
				if (!user) {
				   return callback(false,null);
				}
				
				if (!user.validPassword(oPassword))				
					 return callback(false,null);
				 
				var newUser = new User();
				User.update({"_id": id}, {"$set": { "local.password" : newUser.generatePassword(user.local.hash,nPassword)}}, { upsert: false},function (err, result) {
					if (err)
						throw err;
					return callback(true,user);
				});
		});
	}
	
	return({
		getAllUsers : getAllUsers,
		getRandomPwd : getRandomPwd,
		getLoginUrl : getLoginUrl,
		isEmailExist : isEmailExist,
		resetPassword : resetPassword,
		changePassword : changePassword
	});
})();
