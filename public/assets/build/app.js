angular
    .module('app', [
        'ui.router',
        'ngAnimate',
        'ngResource',
        'ngSanitize',
        'ngMaterial',
        'ngMessages',
        'app.general',
        'app.chat'
    ])
    .config(['$urlRouterProvider', '$stateProvider', '$locationProvider', '$httpProvider', 'AppPaths', '$mdThemingProvider', '$mdDateLocaleProvider',
        function($urlRouterProvider, $stateProvider, $locationProvider, $httpProvider, AppPaths, $mdThemingProvider, $mdDateLocaleProvider) {

            $stateProvider
                .state('app', {
                    url: '/',
                    controller: 'AppController as app',
                    templateUrl: AppPaths.app + 'templates/index.html',
                    abstract: true
                });

            $mdThemingProvider.theme('default')
                .primaryPalette('green', {
                    'default': '800'
                })
                .accentPalette('green', {
                    'default': '700' // use shade 200 for default, and keep all other shades the same
                });

            $mdDateLocaleProvider.formatDate = function(date) {
                return moment(date).format('DD.MM.YYYY');
            };

            $mdDateLocaleProvider.firstDayOfWeek = 1;
            $urlRouterProvider.otherwise('/');

        }])
    .run(['$rootScope', function($rootScope){
    }]);
angular
    .module('app.chat', [
        'ui.router',
        'app.general'
    ]);
angular
    .module('app.general', [
    ]);
angular.module('app')
    .controller('AppController', ['$scope', '$rootScope', '$state', '$http', 'AppPaths', function($scope, $rootScope, $state, $http, AppPaths) {
        var self = this;
    }]);
angular.module('app.chat')
    .controller('ChatController', ['$scope', '$state', '$http', 'AppPaths', function($scope, $state, $http, AppPaths) {
        $scope.users = [
            {name: 'Юзер 1'},
            {name: 'Юзер 2'},
            {name: 'Юзер 3'},
        ];

        $scope.secretChats = [];

        $scope.startChatUser = function(user) {
            var userChat = {
                name: 'Чат с '+user.name,
                description: 'Общение с юзером под именем '+user.name,
                userName: user.name
            };

            $scope.secretChats.push(userChat);
        }
    }]);
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
var app_path = 'assets/angular/app/',
    modules_path = app_path + 'modules/';

angular.module('app.general')
    .constant('AppPaths', {
        app:            app_path,
        modules:        modules_path,
        chat:      modules_path + 'chat/'
    });