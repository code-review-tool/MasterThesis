var app=angular.module("myApp.controllers.chat",[]).controller('ChatCtrl', ['$scope', '$http','$window','$rootScope',
    function($scope,$http,$window,$rootScope) {

        var socket = io.connect();

        $rootScope.chatLog = '';
        $rootScope.isOnline = false;

        /*
        NOTIFY AVAILABILITY
         */
        socket.emit('chatAvailable',{});

        /*
        CHAT METHODS
         */
        $("#chatText").keyup(function(e){
            var code = e.which; // recommended to use e.which, it's normalized across browsers
            if(code==13){
                $rootScope.sendMessage($("#chatText").val());
                $("#chatText").val("");
                $rootScope.$broadcast("documentClicked");
            }
        });
        $rootScope.sendMessage = function(content){
            user = $rootScope.user.chat;
            message = content;

            $('#sendMessage').val('');

            $rootScope.chatLog += formatter(user, message);

            socket.emit('chatSendMessage',{
                'user': user,
                'message': message
            });

        };

        var formatter = function(user, message){
            var d = new Date();
            var hours = d.getHours();
            var minutes = d.getMinutes();

            return hours + ':' + minutes + ' | ' + user + ' - ' +
                message + '\n';
        };

        /*
        SOCKET RESPONSES
         */

        socket.on('chatSendMessage',function(data){
            $rootScope.chatLog += formatter(data.user, data.message);
            $rootScope.$broadcast("documentClicked");
        });

        socket.on('chatAvailable',function(data){
            $rootScope.isOnline = true;

            socket.emit('chatAvailableConfirm',{})
        });

        socket.on('chatAvailableConfirm', function(data){
            $rootScope.isOnline = true;
        });
    }
]);
