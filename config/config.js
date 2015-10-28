//config.js
// Include all configuration variable

module.exports = {
    url : process.env.dburl,
    sessionSecret: process.env.sessionsecret,
    'facebookAuth' : {
        'clientID'      : process.env.fb_clientid,
        'clientSecret'  : process.env.fb_clientsecret,
        'callbackURL'   : process.env.ssocallbackurl + '/auth/facebook/callback'
    },
    
    'twitterAuth' : {
        'consumerKey'       : process.env.tw_consumerkey,
        'consumerSecret'    : process.env.tw_consumersecret,
        'callbackURL'       : process.env.ssocallbackurl + '/auth/twitter/callback'
    },
    
    'googleAuth' : {
        'clientID'      : process.env.gg_clientid,
        'clientSecret'  : process.env.gg_clientsecret,
        'callbackURL'   : process.env.ssocallbackurl + '/auth/google/callback'
    }
};