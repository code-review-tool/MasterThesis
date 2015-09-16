var app=angular.module("myApp.controllers.auth",[]).controller('AdminUserCtrl', ['$scope', '$http','$window','$rootScope',
    function($scope,$http,$window,$rootScope) {

        //Admin User Controller (login, logout)
        $scope.logIn = function logIn(username, password) {
            if (username !== undefined && password !== undefined) {
                $http.post('/api/login',{username: username, password: password}).
                    then(function (response) {
                        $("#loginPanel").hide();
                        $rootScope.getUsers();
                        $rootScope.userName=username;
                        $("#mainPage").show();
                    }, function (response) {
                        $('#failedLogin').show();
                    });
            }
        }
    }
]);
