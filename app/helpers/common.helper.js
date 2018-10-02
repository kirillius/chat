var _ = require('lodash');
var async = require('async');
var ErrorHelper = require('./error.helper');

module.exports = {
    prepareResponse: function(res, next){

        return function(result, errors) {

            if(next) {
                res.locals.result = result;
                res.locals.errors = errors;
                next();
            } else {
                if (errors) {
                    ErrorHelper.errorResponse(res, errors);
                }
                else
                    res.status(200).json(result);
            }
        }
    },
    generateMainPage : function(req, res) {
        //res.sendfile('./public/main.html');
        res.sendfile('./public/auth.html');
    }
};