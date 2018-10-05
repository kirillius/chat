var CommonHelper = require('./common.helper');

module.exports = {
    checkAuth: function(req, res, next){
        if (req.isAuthenticated() && req.user) {
            return next();
        }
        else
            res.redirect('/auth');
    },
    currentUser: function(req, res) {
        if (req.isAuthenticated() && req.user) {
            return CommonHelper.prepareResponse(res)(req.user);
        }
        else
            return CommonHelper.prepareResponse(res)();
    }
};