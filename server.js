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

// Routes
app.get('/', routes.index);
app.get('/partials/:name/', routes.partials);
//app.get('*', routes.index);
app.get('/git_repo', function(req, res){
	var GitHubApi = require("github");

	var github = new GitHubApi({
    	// required
    	version: "3.0.0",
    	// optional
    	debug: true,
    	protocol: "https",
    	host: "api.github.com", // should be api.github.com for GitHub
    	pathPrefix: "", // for some GHEs; none for GitHub
    	timeout: 5000,
    	headers: {
        	"user-agent": "My-Cool-GitHub-App" // GitHub is happy with a unique user agent
    	}
	});
	github.authenticate({
    	type: "basic",
    	username: "code-review-tool",
    	password: "codereviewtool1"
	});
	github.user.getEmails({
	    // optional:
	    // headers: {
	    //     "cookie": "blahblah"
	    // },
    	user: "code-review-tool"
	}, function(err, res) {
    	console.log(JSON.stringify(res));
	});
});

// Configure socket.io route
io.set('log level', 1); // Remove debug messages from socket.io
io.sockets.on('connection', socket);
io.sockets.on('disconnect', function () { console.log("Disconnect!!!");})

// Start listening on default webserver port or 5000
server.listen(appPort)
console.log("Server started on port " + appPort);

