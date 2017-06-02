
var express = require('express'),
    router  = express.Router(),
    async   = require('async'),
    auth    = require('../middleware/authentication'),
    github  = require('../helpers/github');


/* GET home page. */
router.get('/',auth.isLoggedIn, function(req, res, next) {
    res.render('index');
});

router.post('/',auth.isLoggedIn, function (req, res, next) {
   var language = req.body.language;

    github.getUsersInfo(language, function (err, result) {
        if(err) {
            req.flash('error', 'an error accrued please try again');
            res.redirect('/');
        } else {
           res.send(result);
        }
    })



});

module.exports = router;
