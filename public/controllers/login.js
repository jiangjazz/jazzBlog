angular.module('login').controller('LoginController', ['$scope', 'Authentication',
    function($scope, Authentication) {
        //$scope.name = '登录模块';
        $scope.name = Authentication.user ? Authentication.user.fullName : '还没登录';
        $scope.authentication = Authentication;
    }
]);