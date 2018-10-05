module.exports = function() {
    var controllers = [
        'auth', 'message', 'user'
    ];

    var result = {};
    controllers.forEach(function (controllerName) {
        result[controllerName] = require('./' + controllerName + '.controller')();
    });

    return result;
};