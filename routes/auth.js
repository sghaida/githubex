
var express     = require('express'),
    router = express.Router(),
    User        = require('../models/user'),
    passport    = require('passport');

router.get('/login', function (req, res, next) {
    res.render('user/login');
});


router.post('/login',passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
}) , function (req, res, next) {

});

router.get('/logout', function (req, res, next) {
    req.logout();
    req.flash('success', 'You have been logged out')
    res.redirect('/auth/login');
});


router.get('/register', function (req, res, next) {
    res.render('user/register');
});

router.post('/register', function (req, res, next) {
    var newUser = new User({username: req.body.username});
    User.register(newUser,req.body.password, function (err, user) {
        if(err){
            //console.log(err);
            req.flash('error', err.message);
            return res.render('user/register');
        }

        passport.authenticate('local')(req, res, function () {
            req.flash('success', 'GitHub Browser' + user.username);
            res.redirect('/');
        });
        //console.log(user);
    });
});
module.exports = router;