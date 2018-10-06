var _ = require('lodash');
var async = require('async');
var Promise = require('bluebird');
var mongoClient = require("mongodb").MongoClient;
var config = require('../config').getCurrentConfig();

module.exports = {
    get: function(req){
        return new Promise(function (resolve, reject) {
            mongoClient.connect(config.database.server, function(err, client){
                if(err){
                    return reject(err);
                }

                var db = client.db(config.database.name);
                var messagesCollection = db.collection('messages');

                if(req.query && req.query.recipient)
                    messagesCollection.find({
                        $or : [
                            { $and : [ { sender :  req.query.recipient.toString() }, { recipient : req.user.idVK.toString() } ] },
                            { $and : [ { sender : req.user.idVK.toString() }, { recipient : req.query.recipient.toString() } ] }
                        ]
                    }).toArray(function(err, messages) {
                        client.close();
                        return resolve(messages);
                    });
                else {
                    messagesCollection.find({"recipient": null}).toArray(function (err, messages) {
                        client.close();
                        return resolve(messages);
                    });
                }

            });
        });
    },
    create: function(db, data) {
        return new Promise(function (resolve, reject) {

            if(!db)
                return reject({message: "not found mongo connection"});

            var messagesCollection = db.collection('messages');
            var insertedMessage = {
                date: new Date(),
                sender: (data.sender) ? data.sender.toString() : null,
                recipient: (data.recipient) ? data.recipient.toString() : null,
                nameSender: data.nameSender,
                text: data.message
            };

            messagesCollection.insertOne(insertedMessage, function (err, record) {
                if(err) {
                    console.log("err: " + err);
                    return reject(err);
                }

                return resolve();
            });
        });
    }
};

