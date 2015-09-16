var app=angular.module("myApp.factories.restApi",[])
    .service("",['$scope','$http',function($scope,$http) {
        var pulls=[];
        var commentary=[];
        $http.get('https://api.github.com/repos/TiberiuGolaes/Demo/pulls').
            then(function (response) {
                pulls = response.data;
                console.log( pulls);
            }, function (response) {
                console.log("Invalid link");
            });
        $http.get('https://api.github.com/repos/TiberiuGolaes/Demo/pulls/comments').
            then(function (response) {
               commentary= response.data;
                console.log(pulls);
            }, function (response) {
                console.log("Invalid link");
            });
        getPulls=function(){
            return pulls;
        }
        getComments=function(){
            return commentary;
        }
    }]);
