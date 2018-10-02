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