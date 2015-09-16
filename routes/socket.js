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

	/*
	 MENU CLOSE
	 */

	socket.on('buttonClick', function(data) {
		socket.broadcast.emit('buttonClick', {});
	});
	//
	socket.on('menuButtonClick',function(data) {
		socket.broadcast.emit('menuButtonClick', {});
	});
	socket.on('menuClose',function(data) {
		socket.broadcast.emit('menuClose', {});
	});

	/*
	 MENU SOCKET METHODS
	 */

	socket.on('goInformal',function(data) {
		socket.broadcast.emit('goInformal', {});
	});
	socket.on('goIDE',function(data) {
		socket.broadcast.emit('goIDE', {});
	});
	socket.on('goTask',function(data) {
		socket.broadcast.emit('goTask', {});
	});
	socket.on('goDocs',function(data) {
		socket.broadcast.emit('goDocs', {});
	});
	socket.on('goHome',function(data) {
		socket.broadcast.emit('goHome', {});
	});
	/*
	 INFORMAL REVIEW SOCKETS
	 */
	socket.on('showComments',function(data)
	{
		socket.broadcast.emit('showComments',data);
	});
	socket.on('showCode',function(data)
	{
		socket.broadcast.emit('showCode',data);
	});
	socket.on('codeScroll',function(data)
	{
		socket.broadcast.emit('codeScroll',data);
	});
	socket.on('showIDECode',function(data)
	{
		socket.broadcast.emit('showIDECode',data);
	});
	/*
	MOUSE SOCKETS
	 */
	socket.on('mousePosition',function(data) {
		socket.broadcast.emit('mousePosition', data);
	});
	/*
	 IDE SOCKETS
	 */
	socket.on('ideText',function(data)
	{
		socket.broadcast.emit('ideText',data);
	});
	socket.on('showText',function(data)
	{
		socket.broadcast.emit('showText',data);
	});
	socket.on('refresh',function(data)
	{
		socket.broadcast.emit('refresh',data);
	});
	socket.on('ideScroll',function(data)
	{
		socket.broadcast.emit('ideScroll',data);
	});
	socket.on('fileScroll',function(data)
	{
		socket.broadcast.emit('fileScroll',data);
	});
	/** Methods for the video to work */
	/*
	GOOGLE DOCS SOCKETS
	 */
	socket.on('googleDocs', function (data) {
		socket.broadcast.emit('googleDocs',data);
	});
	socket.on('openGDoc', function (data) {
		socket.broadcast.emit('openGDoc',data);
	});
	socket.on('googleScroll', function (data) {
		socket.broadcast.emit('googleScroll',data);
	});
	socket.on('searchText', function (data) {
		socket.broadcast.emit('searchText',data);
	});
	socket.on('message', function(message) {
		// for a real app, would be room only (not broadcast)
		if (message == 'bye') {
			socket.leave('codereview');
		}
		socket.broadcast.emit('message', message);
	});
	/*
	 TASKS SOCKETS
	 */
	socket.on('showIssue', function (data) {
		socket.broadcast.emit('showIssue',data);
	});
	socket.on('showIssueDetails', function (data) {
		socket.broadcast.emit('showIssueDetails',data);
	});
	socket.on('issueScroll', function (data) {
		socket.broadcast.emit('issueScroll',data);
	});
	socket.on('issueDetailsScroll', function (data) {
		socket.broadcast.emit('issueDetailsScroll',data);
	});
	socket.on('issueSmallScroll', function (data) {
		socket.broadcast.emit('issueSmallScroll',data);
	});
	socket.on('informalScroll', function (data) {
		socket.broadcast.emit('informalScroll',data);
	});
	socket.on('commentsScroll', function (data) {
		socket.broadcast.emit('commentsScroll',data);
	});

	/*
	CHAT SOCKETS
	 */
	socket.on('chatSendMessage', function (data) {
		socket.broadcast.emit('chatSendMessage',data);
	});

	socket.on('chatAvailable', function (data) {
		socket.broadcast.emit('chatAvailable',data);
	});

	socket.on('chatAvailableConfirm', function (data) {
		socket.broadcast.emit('chatAvailableConfirm',data);
	});


	/*
	 CALENDAR SOCKETS
	 */
	socket.on('getCalendar', function (data) {
		socket.broadcast.emit('getCalendar',data);
	});
	socket.on('otherJoined',function(data){
		socket.broadcast.emit('otherJoined',data);
	})
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
