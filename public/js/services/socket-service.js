app.factory('socket', function($rootScope) {
	'use strict'; 
	var socket = io.connect();
	var listeners = [];

	return {
		on: function(eventName, callback) {
			socket.on(eventName, function() {
				listeners.push(eventName);
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},
		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			});
		},
		broadcastEmit: function(eventName, data, callback) {
			socket.broadcast.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			});
		},
		removeAllListeners: function(eventName) {
			socket.removeAllListeners(eventName);
		},
		clean: function () {
			for (var i = 0; i < listeners.length; i++) {
				socket.removeAllListeners(listeners[i]);
			}
			listeners = [];
		}
		
	};
});
