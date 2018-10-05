angular.module('app.chat')
    .controller('ChatController', ['$scope', '$state', '$http', 'AppPaths', 'rest', 'socket', function($scope, $state, $http, AppPaths, rest, socket) {

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

            var userChat = {
                name: 'Чат с '+user.name,
                description: 'Общение с юзером под именем '+user.name,
                userName: user.name,
                userId: user.idVK
            };

            $scope.secretChats.push(userChat);
            var index = _.findIndex($scope.secretChats, function(item) {
                return item.userId == user.idVK;
            });

            $scope.selectedIndex = index+1;
        }

        $scope.getUsers = function() {
            rest.get('user').then(function(users) {
                var executingUsers = _.reject(users, function(user) { return user.idVK==$scope.currentUser.idVK });
                $scope.users = executingUsers;
            })
        };

        $scope.initSocket = function() {
            socket.connect({query: "user=" + $scope.currentUser.name + "&userId=" + $scope.currentUser.idVK});

            socket.on('newUser', function(userName){
                //console.log('New user has been connected to chat | ' + userName);
                $scope.messagesAll.push({text: 'В чат входит '+userName});
            });

            socket.on('messageToAll', function(message, name){
                //console.log(name + ' | => ' + message);
                $scope.messagesAll.push({user: name, text: message});
            });

            socket.on('messageToUser', function(message, name, userId){
                //console.log(name + ' | => ' + message);
                var currentChat = _.find($scope.secretChats, function(chat) {
                    return chat.userId==userId;
                });

                if(!currentChat) {
                    //надо создать вкладку чата
                    var currentSob = _.find($scope.users, function(item) {
                        return item.idVK == userId;
                    });

                    var userChat = {
                        name: 'Чат с '+currentSob.name,
                        description: 'Общение с юзером под именем '+currentSob.name,
                        userName: currentSob.name,
                        userId: currentSob.idVK
                    };

                    $scope.secretChats.push(userChat);
                    var index = _.findIndex($scope.secretChats, function(item) {
                        return item.userId == currentSob.idVK;
                    });

                    $scope.selectedIndex = index+1;

                    userChat.messages = [];
                    userChat.messages.push({user: name, text: message});
                }
                else {
                    if (!currentChat.messages)
                        currentChat.messages = [];

                    currentChat.messages.push({user: name, text: message});
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

            chat.messages.push({user: $scope.currentUser.name, text: chat.valueInput});
            chat.valueInput = '';
        }
    }]);