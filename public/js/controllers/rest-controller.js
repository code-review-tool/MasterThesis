var app=angular.module("myApp.controllers.rest",[])
    .controller("RestCtrl",['$scope','$http','$rootScope',function($scope,$http,$rootScope) {

        $rootScope.pulls = [];
        $rootScope.comment= null;
        $rootScope.comments=[];
        $rootScope.files=[];
        $rootScope.issues=[];
        $rootScope.issue=null;
        $rootScope.issueComments=[];
        $rootScope.pullCommentUrl=null;
        $rootScope.contentsUrlIde=null;
        var socket = io.connect();
        $rootScope.repo=null;
        $rootScope.doGetRequests= function() {
            $http.get('https://api.github.com/repos/'+$rootScope.user.repoOwner+'/'+$rootScope.user.repo).
                then(function (response) {
                    $rootScope.repo = response.data;
                    console.log($rootScope.pulls);
                }, function (response) {
                    console.log("Invalid link");
                });
            $http.get('https://api.github.com/repos/'+$rootScope.user.repoOwner+'/'+$rootScope.user.repo+'/pulls').
                then(function (response) {
                    $rootScope.pulls = response.data;
                    console.log($rootScope.pulls);
                }, function (response) {
                    console.log("Invalid link");
                });
            $http.get('https://api.github.com/repos/'+$rootScope.user.repoOwner+'/'+$rootScope.user.repo+'/pulls/comments').
                then(function (response) {
                    $rootScope.commentary = response.data;
                    console.log($rootScope.commentary);
                }, function (response) {
                    console.log("Invalid link");
                });
            $http.get('https://api.github.com/repos/'+$rootScope.user.repoOwner+'/'+$rootScope.user.repo+'/contents/').
                then(function (response) {
                    $rootScope.files = response.data;
                    console.log($rootScope.files);
                }, function (response) {
                    console.log("Invalid link");
                });
            $http.get('https://api.github.com/repos/'+$rootScope.user.repoOwner+'/'+$rootScope.user.repo+'/issues').
                then(function (response) {
                    $rootScope.issues = response.data;
                    console.log("The issues are");
                    console.log($rootScope.issues);
                }, function (response) {
                    console.log("Invalid link");
                });
        }

        $rootScope.getPullFiles = function(url){
            $http.get(url+'/files').
                then(function (response) {
                    $rootScope.getPullFilesResponse = response.data;
                }, function (response) {
                    console.log("repo pull files INVALID");
                });
        };

        $rootScope.saveFile=function()
        {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(editor.getValue()));
            element.setAttribute('download', 'note.txt');
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
        $rootScope.refreshFiles=function()
        {
            $http.get('https://api.github.com/repos/'+$rootScope.user.repoOwner+'/'+$rootScope.user.repo+'/contents/').
                then(function (response) {
                    $rootScope.files= response.data;
                    console.log($rootScope.files);
                }, function (response) {
                    console.log("Invalid link");
                });
            socket.emit('refresh',{});
        }
        $rootScope.doRefreshFiles=function()
        {
            $http.get('https://api.github.com/repos/'+$rootScope.user.repoOwner+'/'+$rootScope.user.repo+'/contents/').
                then(function (response) {
                    $rootScope.files= response.data;
                    console.log($rootScope.files);
                }, function (response) {
                    console.log("Invalid link");
                });
        }

        $rootScope.goText = function(file){
            if(file.type == "file") {
                $http.get(file.url).
                    then(function (response) {
                        console.log(response.data.content);
                        editor.setValue(window.atob(response.data.content));
                    }, function (response) {
                        console.log("Invalid link");
                    });
            }
            else
                $http.get(file.url).
                    then(function (response) {
                        $rootScope.files= response.data;
                        console.log($rootScope.files);
                    }, function (response) {
                        console.log("Invalid link");
                    });
            socket.emit('showText',file);
        };
        $rootScope.showIDECode= function ()
        {
            $("#codeModal").hide();
            $("#ideContainer").show();
            editor.setValue(window.atob($rootScope.contentsUrlIde.content));
            socket.emit('showIDECode',{});
        };
        socket.on('showIDECode',function(data)
        {
            $("#codeModal").hide();
            $("#ideContainer").show();
            editor.setValue(window.atob($rootScope.contentsUrlIde.content));
        });
        $rootScope.getText = function(file){
            if(file.type == "file") {
                $http.get(file.url).
                    then(function (response) {
                        console.log(response.data.content);
                        editor.setValue(window.atob(response.data.content));
                    }, function (response) {
                        console.log("Invalid link");
                    });
            }
            else
                $http.get(file.url).
                    then(function (response) {
                        $rootScope.files= response.data;
                        console.log($rootScope.files);
                    }, function (response) {
                        console.log("Invalid link");
                    });
        };

        $rootScope.goPull = function(url,number){
            $rootScope.pullCommentUrl=url;
            $rootScope.comments=$rootScope.commentary;
            $rootScope.getPullFiles($rootScope.comments[0].pull_request_url);
            console.log($rootScope.commentary);
            $('#informalModal').hide();
            $('#commentsModal').show();
            $('#codeModal').show();
            $("#repoDetails").hide();
            $('#ideContainer').hide();
            socket.emit('showComments',url);
        };

        $rootScope.goIssue = function(url){
            $http.get(url).
                then(function (response) {
                    $("#issuecommentsTable").hide();
                    $rootScope.issue = response.data;
                    console.log( $rootScope.issue.comments_url);
                    $http.get($rootScope.issue.comments_url).
                        then(function (response) {
                            $rootScope.issueComments = response.data;
                            $("#issuecommentsTable").show();
                            console.log("Issue comments are");
                            console.log($rootScope.issueComments);
                        }, function (response) {
                            console.log("Invalid link");
                        });
                }, function (response) {
                    console.log("Invalid link");
                });
            $("#issueDetailModal").show();
            $("#issueSmallModal").show();
            $("#issueModal").hide();
            $("#repoDetails").hide();
            socket.emit('showIssue',url);
        };

        $rootScope.showIssue = function(url){
            $http.get(url).
                then(function (response) {
                    $("#issuecommentsTable").hide();
                    $rootScope.issue = response.data;
                    console.log( $rootScope.issue.comments_url);
                    $http.get($rootScope.issue.comments_url).
                        then(function (response) {
                            $rootScope.issueComments = response.data;
                            $("#issuecommentsTable").show();
                            console.log("Issue comments are");
                            console.log($rootScope.issueComments);
                        }, function (response) {
                            console.log("Invalid link");
                        });
                }, function (response) {
                    console.log("Invalid link");
                });
            $("#issueDetailModal").show();
            $("#issueSmallModal").show();
            $("#repoDetails").hide();
            $("#issueModal").hide();
        };

        $rootScope.goIssueDetails = function(url){
            $http.get(url).
                then(function (response) {
                    $rootScope.issue = response.data;
                    console.log( $rootScope.issue.comments_url);
                    $http.get($rootScope.issue.comments_url).
                        then(function (response) {
                            $rootScope.issueComments = response.data;
                            $("#issuecommentsTable").show();
                            console.log("Issue comments are");
                            console.log($rootScope.issueComments);
                        }, function (response) {
                            console.log("Invalid link");
                        });
                }, function (response) {
                    console.log("Invalid link");
                });
            socket.emit('showIssueDetails',url);
        };

        $rootScope.showIssueDetails = function(url){
            $http.get(url).
                then(function (response) {
                    $rootScope.issue = response.data;
                    console.log( $rootScope.issue.comments_url);
                    $http.get($rootScope.issue.comments_url).
                        then(function (response) {
                            $rootScope.issueComments = response.data;
                            $("#issuecommentsTable").show();
                            console.log("Issue comments are");
                            console.log($rootScope.issueComments);
                        }, function (response) {
                            console.log("Invalid link");
                        });
                }, function (response) {
                    console.log("Invalid link");
                });
        };

        $rootScope.showPull = function(url){
            $rootScope.pullCommentUrl=url;
            $rootScope.comments=$rootScope.commentary;
            $rootScope.getPullFiles($rootScope.comments[0].pull_request_url);
            console.log($rootScope.commentary);

            $rootScope.$broadcast("documentClicked");

            $('#informalModal').hide();
            $('#commentsModal').show();
            $('#codeModal').show();
            $('#ideContainer').hide();
            $("#repoDetails").hide();
        };

        $rootScope.matchFiles = function(){
            /*
             $rootScope.getPullFilesResponse
             $rootScope.comment
             */

            for(var i= 0; i<$rootScope.getPullFilesResponse.length; i++){
                if ($rootScope.comment.path === $rootScope.getPullFilesResponse[i].filename){
                    $http.get($rootScope.getPullFilesResponse[i].contents_url).
                        then(function (response) {
                            $rootScope.contentsUrlIde = response.data;
                        }, function (response) {
                            console.log("Invalid link");
                        });
                }
            }
        };

        $rootScope.goCode = function(id){
            $rootScope.comment=$rootScope.getById($rootScope.comments,'id',id);

            //var filesList = $rootScope.getPullFiles($rootScope.comment.pull_request_url);
            //$rootScope.getPullFiles($rootScope.comment.pull_request_url);

            //$rootScope.getPullFilesResponse;
            $rootScope.matchFiles();
            $('#codeModal').show();

            var contentCode = $rootScope.codeParser($rootScope.comment.diff_hunk);
            document.getElementById("codeContainer").innerHTML = contentCode;

            socket.emit('showCode',id);
        };

        $rootScope.showCode = function(id){
            $rootScope.comment=$rootScope.getById($rootScope.comments,'id',id);
            $('#codeModal').show();
            $rootScope.matchFiles();
            var codeContent = $rootScope.codeParser($rootScope.comment.diff_hunk);
            document.getElementById("codeContainer").innerHTML = codeContent;
        };

        /*
         SOCKET METHODS
         */

        $rootScope.codeParser=function(code){
            var strings= code.split(/\n/);
            var string_to_return="";
            var starting_position=0;
            var red_rows=0;

            for( var i=0;i<strings.length;i++){
                if(i==0){
                    string_to_return=' <div class="input-group" style="height: 30px;width: 100%;margin:0px; padding: 0px;"><span class="input-group-addon" style="background:#F4F7FB;width:10%;"></span><p class="text-justify" style="background:#F4F7FB ;width:90%;height: 100%;vertical-align: middle; display: table-cell; font-family: Courier New;">'+strings[i]+'</p></div>';
                    // string_to_return=string_to_return+'<div class="line-number" style="background:#F4F7FB"> </div> <pre class="code"style="background:#F4F7FB">'+strings[i]+'</pre>';
                    var nr_array=strings[i].match(/\d+/);
                    starting_position=parseInt(nr_array[0], 10);
                }
                else{
                    if(strings[i].substring(0,1)=='-')
                    {
                        var to_display=starting_position+i-1;
                        red_rows=red_rows+1;
                        string_to_return=string_to_return+' <div class="input-group" style="height: 30px;width: 100%;margin:0px; padding: 0px;"><span class="input-group-addon" style="background:#FFECEC;width:10%;">'+to_display+
                            '</span><p class="text-justify" style="background:#FFECEC;width:90%;height: 100%;vertical-align: middle; display: table-cell;font-family: Courier New;">'+strings[i]+'</p></div>';
                        //  string_to_return=string_to_return+'<div class="line-number" style="background:#FFECEC">'+to_display+'<br></div> <pre class="code" style="background:#FFECEC">'+strings[i]+'</pre>';
                    }
                    else if(strings[i].substring(0,1)=='+')
                    {
                        var to_display=starting_position+i-1-red_rows;
                        string_to_return=string_to_return+' <div class="input-group" style="height: 30px;width: 100%;margin:0px; padding: 0px;"><span class="input-group-addon" style="background:#EAFFEA;width:10%;">'+to_display+
                            '</span><p class="text-justify" style="background:#EAFFEA;width:90%;height: 100%;vertical-align: middle; display: table-cell;font-family: Courier New;">'+strings[i]+'</p></div>';
                        //   string_to_return=string_to_return+'<div class="line-number" style="background:#EAFFEA">'+to_display+'<br></div> <pre class="code" style="background:#EAFFEA">'+strings[i]+'</pre>';
                    }
                    else
                    {
                        var to_display=starting_position+i-1-red_rows;
                        string_to_return=string_to_return+' <div class="input-group" style="height: 30px;width: 100%;margin:0px; padding: 0px;"><span class="input-group-addon" style="background:#FFFFFF;width:10%;">'+to_display+
                            '</span><p  style="background:#FFFFFF;width:90%;height: 100%;vertical-align: middle; display: table-cell;font-family: Courier New;">'+strings[i]+'</p></div>';
                        //   string_to_return=string_to_return+'<div class="line-number" style="background:#FFFFFF">'+to_display+'<br></div> <pre class="code" style="background:#FFFFFF">'+strings[i]+'</pre>';
                    }
                }
            }
            return string_to_return;
        };

        $rootScope.getById=function(array, key, value) {
            for (var i = 0; i < array.length; i++) {
                if (array[i][key] === value) {
                    return array[i];
                }
            }
            return null;
        };

        Array.prototype.removeValue = function(name, value){
            var array = $.map(this, function(v,i){
                return v[name] != value ? null : v;
            });
            this.length = 0; //clear original array
            this.push.apply(this, array); //push all elements except the one we want to delete
        };

        Array.prototype.diff = function(a) {
            return this.filter(function(i) {return a.indexOf(i) < 0;});
        };
    }]);
