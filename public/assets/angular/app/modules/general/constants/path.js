var app_path = 'assets/angular/app/',
    modules_path = app_path + 'modules/';

angular.module('app.general')
    .constant('AppPaths', {
        app:            app_path,
        modules:        modules_path,
        chat:      modules_path + 'chat/'
    });