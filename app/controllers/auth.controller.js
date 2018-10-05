var dbAuth = require('../db').auth;

module.exports = function () {
    return {
        currentUser: function(req, res, next) {
            if (!req.user)
                return;

            dbAuth.currentUser(req).then(next).catch(next);
        }
    }
};