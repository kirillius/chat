module.exports = function (db) {
    return {
        currentUser: function(req, res, next) {
            var users = db.collection('users');

            if (!req.user) {
                return;
            }

            users.findOne({'idVK': req.user.idVK}, function(err, user) {
                console.log("user: ");
                console.log(user);

                if(user)
                    users.updateOne({'idVK': req.user.idVK}, { $set: { dateLastLogin : new Date() } }, function(err, result) {
                        console.log("user updated");
                        next();
                    });
                else {
                    var insertedUser = {
                        name: req.user.name,
                        idVK: req.user.idVK,
                        dateLastLogin: new Date()
                    }
                    users.insert(insertedUser, function (err, record) {
                        if(err)
                            console.log("err: "+err);

                        console.log("query executed");
                        next();
                    });
                }
            });
        }
    }
};