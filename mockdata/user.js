var t_pwd = 'aaaa';
var t_email = 'aa@aa.com';
var t_id ='id123123123212';

var user = {
        'id':t_id,
        'email':t_email,
        'password':t_pwd,
        validPassword:function(password){
			if(password == t_pwd){
				return true;
			}else{
				return false;
			}
		}
};

module.exports = {

	//{ 'local.email' :  email,'local.password' :  aaaaa }, function(err, user){});
	findOne: function(obj,callBackHandler){
		if(obj['local.email'] == t_email && obj['local.password'] == t_pwd){
			callBackHandler(false,user);
		}else{
			callBackHandler(false,null);
		}
	},

	findById:function(id,callBackHandler){
		callBackHandler(null,user);
	}

	

	

};