var app=angular.module("myApp.controllers.googlecalendar",[])
    .controller("GoogleCalCtrl",['$scope','$http','$rootScope','$window',function($scope,$http,$rootScope,$window) {


        $rootScope.authenticatedCalendar=false;

        var socket = io.connect();
        var CLIENT_ID = '440571380081-njl8o8khgj7c8unujcpa210rfb443h4v.apps.googleusercontent.com';
        var SCOPES = ['https://www.googleapis.com/auth/calendar'];
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
                }, handleAuthResult2);
        };

        /**
         * Handle response from authorization server.
         *
         * @param {Object} authResult Authorization result.
         */
        var handleAuthResult2 = function (authResult) {
            if (authResult && !authResult.error) {
                // Hide auth UI, then load client library.
                loadCalendarApi();
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
        $rootScope.scheduleMeeting=function()
        {

            var desc=$("#inputDescription").val();
            var summ=$("#inputTitle").val();
            console.log(desc);
            console.log(summ);
            var initial=$("#datetimepicker6").data("DateTimePicker").date();
            var ending=$("#datetimepicker7").data("DateTimePicker").date();
            console.log(initial);
            console.log(ending);
            console.log(initial._d.toISOString());
            console.log(ending._d.toISOString());
            var startT =initial._d.toISOString().substring(0,initial._d.toISOString().length -7)+"00+02:00";
            var end=ending._d.toISOString().substring(0,ending._d.toISOString().length -7)+"00+02:00";
            console.log(startT);
            console.log(end);
            var event={
                'summary': summ,
                'description' : desc,
                'start': {
                    'dateTime': startT
                },
                'end':
                {
                    'dateTime':end
                }
            }
            var request = gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': event
            });
            request.execute(function(resp) {
                $window.alert("Succesfully sent");
            },function (resp) {
            $window.alert("Please check the hour intervals of the event");
            });
            /*  $http.post('https://www.googleapis.com/calendar/v3/calendars/'+$rootScope.calendarID+'/events?maxAttendees=2&sendNotifications=false&supportsAttachments=true&fields=description%2Cend%2Cstart%2Csummary',
                    {end:{
                        dateTime: end
                    } ,
                    start:{
                        dateTime: startT
                    },
                        description: desc,
                        summary : summ
                    }).
                    then(function (response) {
                        $window.alert("Succesfully sent");
                    }, function (response) {
                        $window.alert("Please check the hour intervals of the event");
                    });
                    */
        }

        $rootScope.handleAuthClick2 = function (event) {
            if(!$rootScope.authenticatedCalendar) {
                console.log('auth');
                $rootScope.authenticatedCalendar=true;
                gapi.auth.authorize(
                    {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
                    handleAuthResult2);
                return false;
            }
        };

        /**
         * Load Drive API client library.
         */
        var loadCalendarApi = function() {
            gapi.client.load('calendar', 'v3', listUpcomingEvents);
        };

        /**
         * Print files.
         */
        var listUpcomingEvents = function () {
            var request = gapi.client.calendar.events.list({
                'calendarId': 'primary',
                'timeMin': (new Date()).toISOString(),
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 1000,
                'orderBy': 'startTime'
            });
            request.execute(function(resp) {
                $rootScope.events=resp.items;
                console.log(resp.items);
            });
        };

        $rootScope.goGDocument = function(url)
        {
            $("#googleDocFrame").attr('src',url);
            socket.emit("openGDoc",url);
        };
    }]);
