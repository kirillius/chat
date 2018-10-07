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