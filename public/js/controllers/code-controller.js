angular.module("myApp.controllers.code", [])
	.controller("CodeCtr", ['$scope', 'socket', '$window',
		function($scope, socket, $window) {

			$scope.numOfClicks = 0;

			$scope.onClick = function() {
				socket.emit('buttonClick', {});
			};

			// Socket methods
			socket.on('buttonClick', function (message) {
				$scope.numOfClicks++;
			});
		}
	]);
