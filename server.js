/*
 * Main entry point for the boilerplate
 */

// Port
var appPort = (process.env.PORT || 5001);

// Dependencies
var express = require('express'),
	routes = require('./routes'),
	socket = require('./routes/socket.js')
app = express(),
	fs = require('fs'),
	http = require('http'),
	session = require('express-session'),
	methodOverride = require('method-override'),
	cookieParser = require('cookie-parser'),
	expressSession = require('express-session'),
	bodyParser = require('body-parser'),
	server = http.createServer(app),
	GitHubApi = require("github"),
	myModels = require('./node_models/myModel.js'),
	io = require('socket.io').listen(server);

// Set up app
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', {
	layout: false
});
app.use(methodOverride());
app.use(bodyParser());
app.use(cookieParser());
app.use(expressSession({
	secret: 'codereviewsession'
}));

app.use(express.static(__dirname + '/public'));
app.post('/api/login', function(req, res) {
	var fs = require('fs');
	var text=fs.readFileSync('users.txt').toString();
	var data=JSON.parse(text);
	var found=false;
	for(var i=0; i< data.users.length; i++) {
		if (data.users[i].login === req.body.username) {
			console.log("Found user");
			found = true;
			if (data.users[i].password === req.body.password) {
				res.sendStatus(200);
			}
			else {
				res.sendStatus(404);
			}
		}
	}
	if(found==false)
		res.sendStatus(404);
});
app.post('/api/update', function(req, res) {
	var fs = require('fs');
	var text=fs.readFileSync('users.txt').toString();
	var data=JSON.parse(text);
	var found=false;
	for(var i=0; i< data.users.length; i++) {
		if (data.users[i].login === req.body.username) {
			console.log("Found user");
			found = true;
			data.users[i].iframe= req.body.iframe;
			data.users[i].gitID= req.body.gitid;
			data.users[i].repo= req.body.repo;
			data.users[i].chat= req.body.nick;
			data.users[i].repoOwner= req.body.gitOwner;
		}
	}
	if(found==true) {
		fs.writeFile('users.txt',JSON.stringify(data),null);
		res.sendStatus(200);
	}
	else
		res.sendStatus(404);
});
app.get('/api/users',function(req, res){
		var fs = require('fs');
		var text=fs.readFileSync('users.txt').toString();
		var data=JSON.parse(text);
		res.json(data);
	}
)
//github api

// Routes
app.get('/', routes.index);
app.get('/partials/:name/', routes.partials);


// Configure socket.io route
io.set('log level', 1); // Remove debug messages from socket.io
io.sockets.on('connection', socket);
io.sockets.on('disconnect', function () { console.log("Disconnect!!!");})

// Start listening on default webserver port or 5000
server.listen(appPort)
console.log("Server started on port " + appPort);
