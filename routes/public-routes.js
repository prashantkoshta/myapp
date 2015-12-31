/**
 * New node file
 */
var express = require('express');
var router = express.Router();
/* GET users listing. */

// Public view page
router.get('/sitemap', function(req, res) {
	res.render('public/sitemap.ejs');
});

router.get('/contactus', function(req, res) {
	res.render('public/contactus.ejs');
});

router.get('/termsconditions', function(req, res) {
	res.render('public/terms-coditions.ejs');
});

router.get('/faq', function(req, res) {
	res.render('public/faq.ejs');
});


module.exports = router;