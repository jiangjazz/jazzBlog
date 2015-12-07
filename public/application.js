var mainApplicationModuleName = "JazzBlog";
var mainApplicationModule = angular.module(mainApplicationModuleName, ['ngResource', 'ngRoute', 'login', 'users', 'articles', 'chat']);

mainApplicationModule.config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);


/*facebook特有BUG 第三方登录，未做*/
/*console.log(window.location);
if (window.location.hash === '#_=_') window.location.hash = '#!';*/

angular.element(document).ready(function(){
    angular.bootstrap(document, [mainApplicationModuleName]);
});