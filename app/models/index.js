var _ = require('lodash');
var async = require('async');

module.exports = {
    init: function(onSuccessAll){
        var self = this;

        var models = [
            'users'
        ];

        async.eachSeries(models, function (modelName, callback) {
            self[modelName] = require('./' + modelName + '.model.js')(callback);
        }, onSuccessAll);
    }
};