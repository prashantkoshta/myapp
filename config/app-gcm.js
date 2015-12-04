// To push notificaiton
'use strict';
var config 	= require('./config');
var gcm 		= require("node-gcm")

var AppGCM  = function(){
  
};

AppGCM.prototype.pushNotification = function(data,callback) {

  //Add your mobile device registration tokens here
  var regTokens = [config.serverAPIKey_gcm];
  //Replace your developer API key with GCM enabled here
  var sender = new gcm.Sender(config.senderId_gcm);
  var message = new gcm.Message(); 

  message.addData(data);
  message.addNotification('title', 'BuildInfo');
  message.addNotification('icon', 'ic_launcher');
  message.addNotification('body', 'New Build Added.');
  
  sender.send(message, regTokens, function (err, response) {
    if(err) {
      callback(err);
      console.error(err);
    } else {
      callback(response);
      console.log(response);
    }
  });
  
}
module.exports = new AppGCM();
