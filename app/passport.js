var passport = require('passport');
var AuthVKStrategy = require('passport-vkontakte').Strategy;

module.exports = function (app) {
    var config = require('./config').getCurrentConfig(app);

    passport.use('vk', new AuthVKStrategy({
            clientID: config.auth.vk.app_id, //config.get("auth:vk:app_id"),
            clientSecret: config.auth.vk.secret, //config.get("auth:vk:secret"),
            callbackURL: config.app.url + "/auth/vk/callback"  //config.get("app:url") + "/auth/vk/callback"
        },
        function (accessToken, refreshToken, profile, done) {
            return done(null, {
                idVK: profile.id,
                name: profile.displayName
            });
        }
    ));

    passport.serializeUser(function (user, done) {
        done(null, JSON.stringify(user));
    });


    passport.deserializeUser(function (data, done) {
        try {
            done(null, JSON.parse(data));
        } catch (e) {
            done(err)
        }
    });
};