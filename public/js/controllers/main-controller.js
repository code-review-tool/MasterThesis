var app=angular.module("myApp.controllers.main",[]).controller('mainCtrl', ['$scope', '$http','$window','$rootScope',
    function($scope,$http,$window,$rootScope) {

        $rootScope.users=[];
        $rootScope.otherGit=null;
        $rootScope.otherCalendar=null;
        $rootScope.otherJoined=false;

        var socket = io.connect();

        $rootScope.getUsers = function () {
            $http.get('/api/users').
                then(function (response) {
                    $rootScope.users = response.data;
                    console.log($rootScope.users);
                    for(var i=0;i<$rootScope.users.users.length;i++)
                    {
                        if($rootScope.users.users[i].login === $rootScope.userName)
                        {
                            $rootScope.user=$rootScope.users.users[i];
                            var str=$rootScope.user.iframe;
                            $rootScope.calendarID=str.substring(str.indexOf("=")+1,str.indexOf("&"));
                            console.log('The calendar id is:'+$rootScope.calendarID);
                        }

                    }
                    console.log($rootScope.user);
                }, function (response) {
                    console.log("Invalid link");
                });
        };

        $rootScope.goToInformal= function() {
            $("#mainPage").hide();
            socket.emit("otherJoined",$rootScope.user.gitID);
            $rootScope.logged=true;
            $rootScope.doGetRequests();
        };

        $rootScope.goCalendar=function(){
            $("#mainPage").hide();
            $("#myCalendar").attr('src',$rootScope.user.iframe);
            $rootScope.handleAuthClick2("click");
            if($rootScope.otherCalendar!=null)
                $("#otherCalendar").attr('src',$rootScope.otherCalendar);
            $("#calendarPage").show();
            socket.emit('getCalendar',$rootScope.user.iframe);
        };

        $rootScope.goToMain= function (){
            $("#calendarPage").hide();
            $("#mainPage").show();
        };

        socket.on('getCalendar',function(data){
            $rootScope.otherCalendar=data;
            $rootScope.otherJoined=true;
            $("#otherCalendar").attr('src',$rootScope.otherCalendar);
        });

        $rootScope.updateUser=function()
        {
            var gitID=$("#inputGitUser").val();
            var repo=$("#inputGitRepo").val();
            var gitowner=$("#inputRepoOwner").val();
            var iframe=$("#inputIFrame").val();
            var nick=$('#inputNick').val();

            console.log("Im trying to update with these values: "+gitID+" "+repo+" "+iframe+" "+nick);

            $http.post('/api/update',{username: $rootScope.user.login, password: $rootScope.user.password, gitid: gitID, repo:repo,gitOwner:gitowner, iframe:iframe, nick : nick}).
                then(function (response) {
                    $window.alert("Updated credentials");
                    $rootScope.user.gitID=gitID;
                    $rootScope.user.repo=repo;
                    $rootScope.user.iframe=iframe;
                    $rootScope.user.chat=nick;
                    var str=$rootScope.user.iframe;
                    $rootScope.calendarID=str.substring(str.lastIndexOf("=")+1,str.lastIndexOf("&"));
                    console.log('The calendar id is:'+$rootScope.calendarID);
                }, function (response) {
                    $window.alert("Incorrect user/password");
                });
        };

        socket.on("otherJoined",function(data) {
            console.log(data);
            $rootScope.otherGit=data;
        });
    }
]);
