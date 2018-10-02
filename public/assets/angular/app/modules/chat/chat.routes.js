/**
 * Created by Lavrentev on 02.12.2016.
 */
angular
    .module('app.chat')
    .config(['$stateProvider', 'AppPaths', function($stateProvider, AppPaths) {

        $stateProvider
            .state('app.chat', {
                url: '',
                controller: 'ChatController',
                templateUrl: AppPaths.chat + 'templates/index.html'
            });
    }]);