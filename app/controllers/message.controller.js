var dbMessages = require('../db').messages;
var CommonHelper = require('../helpers').common;

module.exports = function () {
    return {
        getMessage: function (req, res) {
            dbMessages.get(req).then(CommonHelper.prepareResponse(res)).catch(CommonHelper.errorResponse(res))
        }
    }
};