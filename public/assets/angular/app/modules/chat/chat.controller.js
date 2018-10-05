angular.module('app.chat')
    .controller('ChatController', ['$scope', '$state', '$http', 'AppPaths', 'rest', 'socket', function($scope, $state, $http, AppPaths, rest, socket) {

        $scope.currentUser = undefined;
        $scope.users = [];
        $scope.messagesAll = [];
        $scope.secretChats = [];

        $scope.startChatUser = function(user) {
            var userChat = {
                name: 'Чат с '+user.name,
                description: 'Общение с юзером под именем '+user.name,
                userName: user.name,
                userId: user.idVK
            };

            $scope.secretChats.push(userChat);
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

                if(!currentChat)
                    return;

                if(!currentChat.messages)
                    currentChat.messages = [];

                currentChat.messages.push({user: name, text: message});
                //$scope.messagesAll.push({user: name, text: message});
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

        $scope.sendSecretMessage = function(message, userId) {
            socket.emit('secretMessage', {userId: userId, message: message});
            $scope.secretMessage = '123';
        }
    }]);