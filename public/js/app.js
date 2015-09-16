// Start our application and bootstrap all depedencies

var app = angular.module('myApp', ['ngAnimate', 'ngRoute', 'ngSanitize', 'myApp.filters', 'myApp.controllers.code', 'myApp.controllers.video']);

// Configure routes inclusing login checks
app.config(['$routeProvider', '$locationProvider', '$httpProvider',
	function($routeProvider, $locationProvider, $httpProvider) {

		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		}).hashPrefix('!');

		$routeProvider.
		when('/codereview', {
			templateUrl: 'partials/codereview.html',

		}).
		otherwise({
			redirectTo: '/codereview'
		});
	}
]);
