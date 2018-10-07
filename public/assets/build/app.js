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
        var app = this;
    }]);
angular
    .module('app')
    .service('rest', ['$http', function($http){

        var service = {
            baseUrl: '/api/',

            ajax: function(method, uri, data){
                var url = this.baseUrl + uri;
                method = method.toUpperCase();

                console.log(method + ' request: "' + url + '":', data);

                var httpConfig = {
                    method: method,
                    url: url,
                    data: data,
                    timeout: 600000
                };

                return $http(httpConfig).then(function(response){
                    console.log(method + ' response: "' + url + '":', response.data);

                    response.alert = {
                        code: response.data.errorCode,
                        type: response.data.errorCode == "200" ? "success" : "danger",
                        text: response.data.errorMessage
                    };

                    if(response.data && !response.data.length)
                        response.data.statusCode = response.status;

                    return response.data;
                }, function(response){
                    response.alert = {
                        code: response.data.errorCode,
                        type: "danger",
                        text: "Ошибка на сервере. Обратитесь к администратору."
                    };

                    response.data.err = true;
                    return response.data;
                });
            },
            get: function(uri){
                return this.ajax('get', uri);
            },
            post: function(uri, data){
                return this.ajax('post', uri, data);
            },
            put: function(uri, data){
                return this.ajax('put', uri, data);
            },
            delete: function(uri){
                return this.ajax('delete', uri);
            }
        };

        return service;
    }]);
angular.module('app')
    .factory('socket', ['$rootScope', function ($rootScope) {
        var socket;
        return {
            connect: function(params) {
                /*if (!socket) {*/
                    socket = io.connect('', _.extend(_.clone(params), {transports: ['websocket']}));
                /*}*/
            },
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };
    }]);
angular.module('app.chat')
    .controller('ChatController', ['$scope', '$state', '$http', 'AppPaths', 'rest', 'socket', '$q', function($scope, $state, $http, AppPaths, rest, socket, $q) {

        $scope.currentUser = undefined;
        $scope.users = [];
        $scope.messagesAll = [];
        $scope.secretChats = [];
        $scope.selectedIndex = 0;

        $scope.startChatUser = function(user) {
            var chat = _.find($scope.secretChats, function(item) {
                return item.userId == user.idVK;
            });

            if(chat) {
                var index = _.findIndex($scope.secretChats, function(item) {
                    return item.userId == chat.idVK;
                });

                $scope.selectedIndex = index+1;
                return;
            }

            getMessageSecretChat(user.idVK).promise.then(function(messages) {
                generateTabSecretChat(user, messages);
            }).catch(function(err) {
                console.log("error sending message secret");
                console.log(err);
            });
        }

        $scope.getUsers = function() {
            rest.get('user').then(function(users) {
                var executingUsers = _.reject(users, function(user) { return user.idVK==$scope.currentUser.idVK });
                $scope.users = executingUsers;
            });
        };

        $scope.getBasicMessages = function() {
            rest.get('message').then(function(messages) {
                $scope.messagesAll = messages;
            });
        };
        $scope.getBasicMessages();

        $scope.initSocket = function() {
            socket.connect({query: "user=" + $scope.currentUser.name + "&userId=" + $scope.currentUser.idVK});

            socket.on('newUser', function(userName){
                $scope.messagesAll.push({text: 'В чат входит '+userName});
            });

            socket.on('messageToAll', function(message, name){
                $scope.messagesAll.push({nameSender: name, text: message});
            });

            socket.on('messageToUser', function(message, name, userId){
                var currentChat = _.find($scope.secretChats, function(chat) {
                    return chat.userId==userId;
                });

                if(!currentChat) {
                    //надо создать вкладку чата
                    var currentSob = _.find($scope.users, function(item) {
                        return item.idVK == userId;
                    });

                    generateTabSecretChat(currentSob, [{nameSender: name, text: message}]);
                }
                else {
                    if (!currentChat.messages)
                        currentChat.messages = [];

                    currentChat.messages.push({nameSender: name, text: message});
                }
            });
        }

        $scope.getCurrentUser = function() {
            rest.get('current_user').then(function(currentUser) {
                localStorage.setItem('app.currentUser', JSON.stringify(currentUser));
                $scope.currentUser = currentUser;
                $scope.initSocket();
                $scope.getUsers();
            })
        }
        $scope.getCurrentUser();

        $scope.sendMessage = function(message) {
            socket.emit('message', message);
            $scope.message = '';
        }

        $scope.sendSecretMessage = function(chat) {
            socket.emit('secretMessage', {userId: chat.userId, message: chat.valueInput});

            if(!chat.messages)
                chat.messages = [];

            chat.messages.push({nameSender: $scope.currentUser.name, text: chat.valueInput});
            chat.valueInput = '';
        }

        var generateTabSecretChat = function(user, messages) {
            var userChat = {
                name: 'Чат с '+user.name,
                description: 'Общение с юзером под именем '+user.name,
                userName: user.name,
                userId: user.idVK
            };
            userChat.messages = messages;

            $scope.secretChats.push(userChat);
            var index = _.findIndex($scope.secretChats, function(item) {
                return item.userId == user.idVK;
            });

            $scope.selectedIndex = index+1;
        };

        var getMessageSecretChat = function(userId) {
            var deferred = $q.defer();
            rest.get('message?recipient='+userId).then(function(messages) {
                deferred.resolve(messages);
            }).catch(function(err) {
                deferred.reject(err);
            });

            return deferred;
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