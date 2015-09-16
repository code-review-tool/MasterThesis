var app=angular.module("myApp.controllers.googledrive",[])
    .controller("GoogleDriveCtrl",['$scope','$http','$rootScope',function($scope,$http,$rootScope) {

        $rootScope.documents=[];
        $rootScope.authenticated=false;

        var socket = io.connect();
        var CLIENT_ID = '440571380081-njl8o8khgj7c8unujcpa210rfb443h4v.apps.googleusercontent.com';
        var SCOPES = ['https://www.googleapis.com/auth/drive.file'];

        console.log('Google Drive controller has booted up');

        /**
         * Check if current user has authorized this application.
         */
        var checkAuth = function() {
            gapi.auth.authorize(
                {
                    'client_id': CLIENT_ID,
                    'scope': SCOPES,
                    'immediate': true
                }, handleAuthResult);
        };

        /**
         * Handle response from authorization server.
         *
         * @param {Object} authResult Authorization result.
         */
        var handleAuthResult = function (authResult) {
            if (authResult && !authResult.error) {
                // Hide auth UI, then load client library.
                loadDriveApi();
            } else {
                // Show auth UI, allowing the user to initiate authorization by
                // clicking authorize button.
                authorizeDiv.style.display = 'inline';
            }
        };

        /**
         * Initiate auth flow in response to user clicking authorize button.
         *
         * @param {Event} event Button click event.
         */

        $rootScope.handleAuthClick = function (event) {
            if(!$rootScope.authenticated) {
                console.log('auth');
                $rootScope.authenticated=true;
                gapi.auth.authorize(
                    {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
                    handleAuthResult);
                return false;
            }
        };

        /**
         * Load Drive API client library.
         */
        var loadDriveApi = function() {
            gapi.client.load('drive', 'v2', listFiles);
        };

        /**
         * Print files.
         */
        var listFiles = function () {
            var request = gapi.client.drive.files.list({
                'maxResults': 1000
            });
            request.execute(function(resp) {
                $rootScope.documents=resp.items;
                socket.emit("googleDocs",resp.items);
                $rootScope.$broadcast("documentClicked");
                console.log(resp.items);
            });
        };

        $rootScope.goGDocument = function(url)
        {
            $("#googleDocFrame").attr('src',url);
            socket.emit("openGDoc",url);
        };
    }]);
