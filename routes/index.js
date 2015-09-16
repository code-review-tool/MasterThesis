/*
* Simple routing for HTTP requests
*/
exports.index = function(req, res) {
	'use strict';
	res.render('index');
};

exports.partials = function(req, res) {
	var name = req.params.name;
	res.render('partials/' + name);
};