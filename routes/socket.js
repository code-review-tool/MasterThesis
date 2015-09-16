/*
 * Server-side module that handles Socket.IO communication
 */

// Logging
var winston = require('winston');
winston.add(winston.transports.File, {
	filename: 'log.log'
});



// Socket.io methods -- TODO: Move to seperate module
var sock = module.exports = function(socket) {
	'use strict';

	/** Add your socket methods here */

	socket.on('buttonClick', function(data) {
		socket.broadcast.emit('buttonClick', {});
	});



	/** Methods for the video to work */
	
	socket.on('message', function(message) {
		// for a real app, would be room only (not broadcast)
		if (message == 'bye') {
			socket.leave('codereview');
		}
		socket.broadcast.emit('message', message);
	});

	var connectedWithVideo = [];

	// Used for the video
	socket.on('create or join', function(room) {
		var numClients = 0;
		var clients = io.sockets.adapter.rooms[room];

		for (var clientId in clients) {
		  numClients++;
		}

		if (numClients === 0) {
			console.log("Created room");
			socket.join(room);
			socket.emit('created', room);

		} else if (numClients === 1) {
			console.log("Joined room");
			io.sockets. in (room).emit('join', room);
			socket.join(room);
			socket.emit('joined', room);
		} else { // max two clients
			socket.emit('full', room);
		}
		socket.emit('emit(): client ' + socket.id + ' joined room ' + room);
		socket.broadcast.emit('broadcast(): client ' + socket.id + ' joined room ' + room);

	});

	// Handle disconnect
	socket.on('disconnect', function(message) {
		winston.log('info', "User disconnect");
	});
};
