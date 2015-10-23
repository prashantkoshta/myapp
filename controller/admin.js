// load up the user model
var User            = require('../models/user');

module.exports = {
    getAllUsers : function (req,res) {
        User.find(function(err, users) {
            // if there are any errors, return the error before anything else
            if (err)
                return -1;
            console.log(users.length);
            //console.log(users[0],users[0].local.email);
            //return users;
            console.log(">>",users);
            res.render('admin.ejs',{result:users});
        });
    }
};