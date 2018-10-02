var _ = require('lodash');

module.exports = function(app){

    //var controllers = require('./controllers')();
    var helpers = require('./helpers');

    //Auth logic
    /*app.get("/ntlm-auth", passport.authenticate('passport-windowsauth'), function(req, res) {
        res.redirect('/');
    });
    app.get("/auth", passport.authenticate('passport-windowsauth'), controllers.auth.currentUser);
    app.get("/api/current_user", controllers.auth.currentUser);*/

    //Define all routes
    //defineRestResource('company');

    //app.get("/*", helpers.auth.checkAuth, helpers.common.generateMainPage);
    app.get("/*", helpers.common.generateMainPage);

    function defineRestResource(modelName){
        var UpperFirstName = _.upperFirst(modelName);

        var controller = controllers[modelName];

        // в REST-запросы добавлена дополнительная итерация: helpers.logs.responseAndAddLog(modelName, 'create')
        // для логирования действий над узлами дерева и их параметрами
        //helpers.auth.checkAuth,
        app.get("/api/" + modelName, controller['get' + UpperFirstName], helpers.logs.responseAndAddLog(modelName, 'get'));
        app.get("/api/" + modelName + "/:id", controller['show' + UpperFirstName], helpers.logs.responseAndAddLog(modelName, 'get'));

        if(controller['create' + UpperFirstName])
            app.post("/api/" + modelName, helpers.auth.checkRoleAndPermission(modelName, 'Edit'), controller['create' + UpperFirstName], helpers.logs.responseAndAddLog(modelName, 'create'));

        if(controller['update' + UpperFirstName])
            app.put("/api/" + modelName + "/:id", helpers.auth.checkRoleAndPermission(modelName, 'Edit'), controller['update' + UpperFirstName], helpers.logs.responseAndAddLog(modelName, 'update'));

        if(controller['delete' + UpperFirstName])
            app.delete("/api/" + modelName + "/:id", helpers.auth.checkRoleAndPermission(modelName, 'Delete'), controller['delete' + UpperFirstName], helpers.logs.responseAndAddLog(modelName, 'delete'));

        if(controller['restore' + UpperFirstName])
            app.post("/api/" + modelName + "_restore", helpers.auth.checkRoleAndPermission(modelName, 'Delete'), controller['restore' + UpperFirstName], helpers.logs.responseAndAddLog(modelName, 'restore'));

        if(controller['copy' + UpperFirstName])
            app.post("/api/" + modelName + "_copy", helpers.auth.checkRoleAndPermission(modelName, 'Edit'), controller['copy' + UpperFirstName], helpers.logs.responseAndAddLog(modelName, 'copy'));

        console.log('rest routes for resource ' + modelName + ' is defined');
    }
};