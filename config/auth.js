// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : process.env.fb_clientid,//'your-secret-clientID-here', // your App ID
        'clientSecret'  : process.env.fb_clientsecret,//your-client-secret-here', // your App Secret
        'callbackURL'   : 'https://obscure-basin-3340.herokuapp.com/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : process.env.consumerkey,//'your-consumer-key-here',
        'consumerSecret'    :  process.env.consumersecret,//'your-client-secret-here',
        'callbackURL'       : 'https://obscure-basin-3340.herokuapp.com/auth/twitter/callback'//http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : process.env.gg_clientid,
        'clientSecret'  : process.env.gg_clientsecret,
        'callbackURL'   : 'https://obscure-basin-3340.herokuapp.com/auth/google/callback'
    }

};