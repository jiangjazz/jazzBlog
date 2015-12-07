angular.module('articles').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        /*when('/articles', {
            templateUrl: 'views/list-article.html'
        }).*/
        when('/articles/create', {
            templateUrl: 'views/create-article.html'
        }).
        when('/articles/:articleId', {
            templateUrl: 'views/view-article.html'
        }).
        when('/articles/:articleId/edit', {
            templateUrl: 'views/edit-article.html'
        });
    }
]);