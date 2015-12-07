angular.module('login').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
            "templateUrl": 'views/list-article.html'
        }).
        when('/chat', {
            "templateUrl": 'views/chat.html'
        }).otherwise({
            "redirectTo": '/'
        });
    }
]);