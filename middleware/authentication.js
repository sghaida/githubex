
exports.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('error','Please login first')
        res.redirect('/auth/login');
    }
};
