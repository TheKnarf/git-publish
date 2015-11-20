#!/usr/bin/env node

var GitHubApi = require("github");
var name = process.argv[2];

if(typeof name == 'undefined') {
	console.error('Missing argument name');
	process.exit(1);	
}


var github = new GitHubApi({
	version: '3.0.0'
});

github.authenticate({
	type: 'basic',
	username: process.env.username,
	password: process.env.password
});

github.repos.create({
	name: name
}, function(error, result) {
	if(error != null)
		process.exit(1);

	console.log(result['clone_url']);
});
