var faye = require('faye')
var fayeBayeux = function fayeBayeux(){
    //defining a var instead of this (works for variable & function) will create a private definition
    var bayeux = new faye.NodeAdapter({
			    mount: '/faye',
			    timeout: 600000000000
	});
	
    this.getBayeux = function(){
        return bayeux;
    };
	
	this.pulishMessage = function(channel,data){
	   bayeux.getClient().publish(channel,data);
	   // console.log('broadcast message:' + req.body.message);
	   //res.send(200);
	};
	
    if(fayeBayeux.caller != fayeBayeux.getInstance){
        throw new Error("This object cannot be instanciated");
    }
}
/* ************************************************************************
fayeBayeux CLASS DEFINITION
************************************************************************ */
fayeBayeux.instance = null;
/**
 * fayeBayeux getInstance definition
 * @return fayeBayeux class
 */
fayeBayeux.getInstance = function(){
    if(this.instance === null){
        this.instance = new fayeBayeux();
    }
    return this.instance;
}
module.exports = fayeBayeux.getInstance();
