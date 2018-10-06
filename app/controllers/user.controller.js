var dbUsers = require('../db').users;
var CommonHelper = require('../helpers').common;

module.exports = function () {
    return {
        getUser: function (req, res) {
            dbUsers.get().then(CommonHelper.prepareResponse(res)).catch(CommonHelper.errorResponse(res));
        }
    }
};