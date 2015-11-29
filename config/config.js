//config.js
// Include all configuration variable
module.exports = require('../../localconfig.js');
/*module.exports = {
    url : process.env.dburl,
    sessionSecret: process.env.sessionsecret,
    staticPublicDir : process.env.staticpublicdir,
    staticPrivateDir : process.env.staticprivatedir,
    viewsDir : process.env.private,
    staticPrivateContextPath : process.env.staticprivatecontextpath,
    sendMail: process.env.sendmail,
    sendMailAuth: process.env.sendmailauth,
    uploadDir : process.env.uploaddir,
    recaptchasecretkey : process.env.recaptchasecretkey,
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
};*/