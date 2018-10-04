var _ = require('lodash');

module.exports = {
    'general': {
        database: {
            name: 'chat',
            server: 'mongodb://localhost:27017'
        },
        app: {
            url: "http://localhost:2300"
        },
        auth: {
            vk: {
                app_id: '6710838',
                secret: 'oRGASPRdEU5p2HCsiSOF'
            }
        }
    },
    'production': {
    },
    'development': {
    },
    'getCurrentConfig': function(app){
        var defaultEnvironment = 'production';
        return _.merge({}, this.general, this[app.get('env') || defaultEnvironment]);
    }
};