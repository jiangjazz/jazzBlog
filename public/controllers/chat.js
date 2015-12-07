angular.module('chat').controller('ChatController', ['$scope', 'Socket', 'Authentication',
    function($scope, Socket, Authentication) {
        $scope.messages = [];
        $scope.self = Authentication.user.username;
        //console.log(Authentication.user.username);
        Socket.on('chatMessage', function(message) {
            $scope.messages.push(message);
            //console.log($scope.messages);
        });
        $scope.sendMessage = function() {
            var message = {
                text: this.messageText,
                self: Authentication.user.username
            };
            Socket.emit('chatMessage', message);
            this.messageText = '';
        }
        $scope.$on('$destroy', function() {
            Socket.removeListener('chatMessage');
        })
    }
]);