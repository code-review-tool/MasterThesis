var app=angular.module("myApp.controllers.aside",['ngRoute','ngAnimate'])
    .controller("asideCtr", function($scope,$location, $rootScope) {
        var socket = io.connect();
        $scope.rightVisible = false;
        $rootScope.logged= false;
        $scope.close = function() {
            if($scope.rightVisible != false)
            {
                $scope.rightVisible = false;
                $rootScope.$broadcast("documentClicked");
                socket.emit('menuClose',{})
            }
        };

        $scope.showRight = function(e) {
            $scope.rightVisible = true;
            e.stopPropagation();
        };

        $scope.showMenu = function(e){
            if($scope.rightVisible == false)
            {
                socket.emit('menuButtonClick',{});
                $scope.showRight(e);
            }
        };

        /*
         MENU FUNCTIONS
         */

        $scope.goInformalReview = function() {
            $scope.setupInformalReview();

            socket.emit('goInformal',{});
        };

        $scope.goIDE = function() {
            $scope.setupIDE();

            socket.emit('goIDE',{});
        };

        $scope.goTask = function() {
            $scope.setupTask();

            socket.emit('goTask',{});
        };

        $scope.goDocs = function(){
            $scope.setupDocs();

            $rootScope.handleAuthClick("click");

            socket.emit('goDocs',{});
        };

        $scope.goHome = function(){
            $scope.homePageTransition();

            socket.emit('goHome',{});
        };
        $scope.goMainMenu = function()
        {
            $rootScope.logged=false;
            $("#mainPage").show();
        }
        /*
         UI SETUPS
         */

        $scope.setupInformalReview = function() {
            $scope.threeDivTransition();

            $("#informalModal").show();
            $("#repoDetails").show();
            $("#ideConainter").hide();
            $("#googleDocFrame").hide();
            $('#googleDriveModal').hide();
            $("#commentsModal").hide();
            $("#filesModal").hide();
            $("#codeModal").hide();
            $("#issueModal").hide();
            $("#issueSmallModal").hide();
            $("#issueDetailModal").hide();
        };

        $scope.setupIDE = function() {
            $scope.threeDivTransition();
            editor.setValue("");
            $("#ideContainer").show();
            $("#filesModal").show();
            $('#googleDriveModal').hide();
            $("#informalModal").hide();
            $("#googleDocFrame").hide();
            $("#commentsModal").hide();
            $("#codeModal").hide();
            $("#issueModal").hide();
            $("#issueSmallModal").hide();
            $("#issueDetailModal").hide();
            $("#repoDetails").hide();
        };

        $scope.setupTask = function(){
            $scope.threeDivTransition();

            $("#issueModal").show();
            $("#repoDetails").show();
            $("#informalModal").hide();
            $("#ideConainter").hide();
            $("#googleDocFrame").hide();
            $('#googleDriveModal').hide();
            $("#commentsModal").hide();
            $("#filesModal").hide();
            $("#codeModal").hide();
            $("#issueSmallModal").hide();
            $("#issueDetailModal").hide();
        };

        $scope.setupDocs = function(){
            $scope.threeDivTransition();

            $('#googleDriveModal').show();
            $("#googleDocFrame").show();
            $("#ideContainer").hide();
            $("#filesModal").hide();
            $("#informalModal").hide();
            $("#commentsModal").hide();
            $("#codeModal").hide();
            $("#issueSmallModal").hide();
            $("#issueModal").hide();
            $("#repoDetails").hide();
            $("#issueDetailModal").hide();
        };

        /*
         SOCKET RESPONSES
         */

        socket.on('menuClose',function(data)
        {
            if($scope.rightVisible != false) {
                $scope.close();
            }
        });

        socket.on('menuButtonClick',function(data) {
            if($scope.rightVisible == false) {
                $("#menuButton").click();
            }
        });

        socket.on('goInformal',function(data){
            $scope.setupInformalReview();
        });

        socket.on('goTask', function(data){
            $scope.setupTask();
        });

        socket.on('goIDE', function(data){
            $scope.setupIDE();
        });

        socket.on('goDocs', function(data){
            $scope.setupDocs();
        });

        socket.on('goHome', function(data){
            $scope.homePageTransition();
        });

        socket.on('showComments', function(data){
            $rootScope.showPull(data);
        });

        socket.on('showIssue', function(data){
            $rootScope.showIssue(data);
        });

        socket.on('showIssueDetails', function(data){
            $rootScope.showIssueDetails(data);
        });

        socket.on('showCode', function(data){
            $rootScope.showCode(data);
        });

        socket.on('ideText', function(data){
            editor.setValue(data);
        });

        socket.on('showText', function(data){
            $rootScope.getText(data);
        });

        socket.on('refresh', function(data){
            $rootScope.doRefreshFiles();
        });

        socket.on('codeScroll',function(data){
            $("#codeContainer").scrollTop(data);
        });

        socket.on('ideScroll',function(data){
            $(".ace_scrollbar").scrollTop(data);
        });

        socket.on('issueScroll', function (data) {
            $("#issueModal").scrollTop(data);
        });

        socket.on('informalScroll',function(data){
            $("#informalModal").scrollTop(data);
        });

        socket.on('commentsScroll', function (data) {
            $("#commentsModal").scrollTop(data);
        });

        socket.on('issueDetailsScroll', function (data) {
            $("#issueDetailModal").scrollTop(data);
        });

        socket.on('issueSmallScroll', function (data) {
            $("#issueSmallModal").scrollTop(data);
        });

        socket.on('fileScroll',function(data){
            $("#filesContainer").scrollTop(data);
        });

        socket.on('googleDocs',function(data){
            console.log("Received some google docs.Check it out");
            $rootScope.$broadcast("documentClicked");
            $rootScope.documents=data;
        });

        socket.on('openGDoc',function(data){
            $("#googleDocFrame").attr('src',data);
        });

        socket.on('googleScroll',function(data){
            $("#googleDocScroll").scrollTop(data);
        });

        socket.on('searchText',function(data){
            $('#searchField').val(data);
            $('#searchField').trigger("change");
        });

        socket.on('mousePosition', function(data){
            var xCord = data.xPercent * $( document ).width() / 100;
            var yCord = data.yPercent * $( document ).height() / 100;

            $('.mouse-pointer').css({
                "left": xCord + 'px',
                "top": yCord + 'px'
            });
        });

        /*
         UTILS METHOD DUMPS
         */

        $scope.threeDivTransition = function () {
            $(".downright").css({
                "width": "50%",
                "height": "50%",
                "position": "fixed",
                "bottom": "0",
                "right": "0",
                "left": "auto",
                "top": "auto"
            });

            $(".overlay").css({
                "left" : "auto"
            });

            $(".left").css({
                "visibility": "initial",
                "border-right": "thick double black"
            });

            $(".topright").css({
                "visibility": "initial",
                "border-bottom": "thick double black"
            });
        };

        $scope.homePageTransition = function (){
            $(".downright").css({
                "width": "auto",
                "height": "auto",
                "position": "relative",
                "bottom": "auto",
                "right": "auto",
                "top": "0",
                "left": "0"
            });

            $(".overlay").css({
                "left": "0"
            });

            $(".left").css({
                "visibility": "hidden"
            });

            $(".topright").css({
                "visibility": "hidden"
            });
        };

        $scope.clearDivs = function (){
            $(".left").empty();
            $(".topright").empty();
        };

        $rootScope.$on("documentClicked", _close);
        $rootScope.$on("escapePressed", _close);

        function _close() {
            $scope.$apply(function() {
                $scope.close();
            });
        }
    });

app.run(function($rootScope) {
    document.addEventListener("keyup", function(e) {
        if (e.keyCode === 27)
            $rootScope.$broadcast("escapePressed", e.target);
    });

    document.addEventListener("click", function(e) {
        if(e.srcElement.getAttribute("id")!="menuButton")
            $rootScope.$broadcast("documentClicked", e.target);
    });
});

app.directive("menu", function() {
        return {
            restrict: "E",
            template: "<div ng-class='{ show: visible, left: alignment === \"left\", right: alignment === \"right\" }' ng-transclude></div>",
            transclude: true,
            scope: {
                visible: "=",
                alignment: "@"
            }
        };
    },
    app.directive("menuItem", function() {
        return {
            restrict: "E",
            template: "<div ng-transclude></div>",
            transclude: true,
            scope: {
                hash: "@"
            },
            link: function($scope) {
                $scope.navigate = function() {
                    window.location.hash = $scope.hash;
                }
            }
        }
    })
);
