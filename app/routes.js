var _ = require('lodash');
var passport = require('passport');

module.exports = function(app){

    var controllers = require('./controllers')();
    var helpers = require('./helpers');

    app.get('/api/current_user', helpers.auth.currentUser);

    app.get('/auth/vk',
        passport.authenticate('vk', {
            scope: ['friends']
        }),
        function (req, res) {
            // The request will be redirected to vk.com
            // for authentication, so
            // this function will not be called.
        });

    app.get('/auth/vk/callback',
        passport.authenticate('vk', {
            failureRedirect: '/auth'
        }),
        controllers.auth.currentUser,
        function (req, res) {
            // Successful authentication
            //, redirect home.
            res.redirect('/');
        });

    //Define all routes
    defineRestResource('user');
    defineRestResource('message');

    app.get("/auth", helpers.common.generateAuthPage);
    app.get("/*", helpers.auth.checkAuth, helpers.common.generateMainPage);

    function defineRestResource(modelName){
        var UpperFirstName = _.upperFirst(modelName);

        var controller = controllers[modelName];

        app.get("/api/" + modelName, controller['get' + UpperFirstName]);
        //app.get("/api/" + modelName + "/:id", controller['show' + UpperFirstName]);

        if(controller['create' + UpperFirstName])
            app.post("/api/" + modelName, controller['create' + UpperFirstName]);


        console.log('rest routes for resource ' + modelName + ' is defined');
    }
};