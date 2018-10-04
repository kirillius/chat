var _ = require('lodash');
var async = require('async');
var Users = require('../models').users;

module.exports = {
    checkAuth: function(req, res, next){
        if (req.isAuthenticated() && req.user) {
            return next();
        }
        else
            res.redirect('/auth');
    }
};