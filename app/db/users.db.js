var _ = require('lodash');
var async = require('async');
var Promise = require('bluebird');
var mongoClient = require("mongodb").MongoClient;
var config = require('../config').getCurrentConfig();

module.exports = {
    get: function(){
        return new Promise(function (resolve, reject) {
            mongoClient.connect(config.database.server, function(err, client){
                if(err){
                    return reject(err);
                }

                console.log("success connection to mongo");

                var db = client.db(config.database.name);
                var usersCollection = db.collection('users');
                usersCollection.find({}).toArray(function(err, users) {
                    client.close();
                    return resolve(users);
                });
            });
        });
    }
};