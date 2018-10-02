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