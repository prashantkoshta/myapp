// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var crypto   = require('crypto');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
        firstname    : String,
        middlename   : String,
        lastname     : String,
        address1     : String,
        address2     : String,
        city         : String,
        zipcode      : Number,
        role         : String,
        sec_question_1 : String,
        sec_answer_1   : String,
        sec_question_2 : String,
        sec_answer_2   : String,
        passcode       : Number,
        hash		: String
		
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function() {
    var hash = this.getRandomPwd(8,'qwertyuiopasdfg@!hjklzxcv#%bnmQWERTYUIO$PASDFGHJKLZXCVBNM12345*?67890');
	return hash;
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
	var hash = crypto.createHmac("sha512",this.local.hash);
	hash.update(password);
	var val = hash.digest("base64");
	return (val === this.local.password) ? true : false;
};

userSchema.methods.generatePassword = function(ahash,password) {
	var hash = crypto.createHmac("sha512",ahash);
	hash.update(password);
	return hash.digest("base64");
};

userSchema.methods.getRandomPwd = function(n, a) {
  var index = (Math.random() * (a.length - 1)).toFixed(0);
  return n > 0 ? a[index] + this.getRandomPwd(n - 1, a) : '';
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);