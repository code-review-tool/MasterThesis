var app = angular.module('myApp', ['ngAnimate', 'ngRoute', 'ngSanitize', 'myApp.filters', 'myApp.controllers.code','myApp.controllers.video',
    'myApp.controllers.aside','myApp.controllers.auth','myApp.controllers.rest','myApp.controllers.googledrive','myApp.controllers.googlecalendar','myApp.controllers.main','myApp.controllers.chat']);

// Configure routes inclusing login checks
app.config(['$routeProvider', '$locationProvider', '$httpProvider',
    function($routeProvider, $locationProvider, $httpProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        }).hashPrefix('!');
        $routeProvider.
            when('/', {
                templateUrl: 'partials/codereview.html',
            }).
            when('/informalreview', {
                templateURL: 'partials/informalreview.html',
            })
            .
            otherwise({
                redirectTo: '/'
            });
    }]);
