
angular.module("myApp.controllers.code", [])
	.controller("CodeCtr", ['$scope', 'socket', '$window',
		function($scope, socket, $window) {
			
			// Scope methods
			$scope.numOfClicks = 0;
			
			$scope.onClick = function() {
				console.log("Button clicked");
				socket.emit('buttonClick', {});
			}
			
			// Socket methods
			socket.on('buttonClick', function (message) {
				$scope.numOfClicks++;
			});
		}
	]);
