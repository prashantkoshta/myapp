//config.js
// Include all configuration variable
module.exports = {
    url :  process.env.dburl,
    sessionSecret: process.env.sessionsecret,
    'facebookAuth' : {
        'clientID'      : process.env.fb_clientid,//'your-secret-clientID-here', // your App ID
        'clientSecret'  : process.env.fb_clientsecret,//your-client-secret-here', // your App Secret
        'callbackURL'   : process.env.ssocallbackurl+'/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : process.env.consumerkey,//'your-consumer-key-here',
        'consumerSecret'    : process.env.consumersecret,//'your-client-secret-here',
        'callbackURL'       : process.env.ssocallbackurl+'/auth/twitter/callback'//http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : process.env.gg_clientid,
        'clientSecret'  : process.env.gg_clientsecret,
        'callbackURL'   : process.env.ssocallbackurl+'/auth/google/callback'
    }
}