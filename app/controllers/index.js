module.exports = function(db) {
    var controllers = [
        'auth', 'message', 'user'
    ];

    var result = {};
    controllers.forEach(function (controllerName) {
        result[controllerName] = require('./' + controllerName + '.controller')(db);
    });

    return result;
};