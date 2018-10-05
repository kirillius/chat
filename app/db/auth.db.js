var _ = require('lodash');
var async = require('async');
var Promise = require('bluebird');
var mongoClient = require("mongodb").MongoClient;
var config = require('../config').getCurrentConfig();

module.exports = {
    currentUser: function(req){
        return new Promise(function (resolve, reject) {
            mongoClient.connect(config.database.server, function(err, client){
                if(err){
                    return reject(err);
                }

                var db = client.db(config.database.name);
                var users = db.collection('users');

                users.findOne({'idVK': req.user.idVK}, function(err, user) {
                    if(user)
                        users.updateOne({'idVK': req.user.idVK}, { $set: { dateLastLogin : new Date() } }, function(err, result) {
                            console.log("user updated");
                            client.close();
                            return resolve();
                        });
                    else {
                        var insertedUser = {
                            name: req.user.name,
                            idVK: req.user.idVK,
                            dateLastLogin: new Date()
                        }
                        users.insert(insertedUser, function (err, record) {
                            if(err) {
                                console.log("err: " + err);
                                return reject(err);
                            }

                            console.log("query executed");
                            client.close();
                            return resolve();
                        });
                    }
                });
            });
        });
    }
};