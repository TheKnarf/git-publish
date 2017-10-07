#!/usr/bin/env node

var GitHubApi = require("github");

const argv = require('yargs')
	.demandOption(['name', 'password', 'username'])
	.option('name', {
		alias: 'n'
	})
	.option('password', {
		alias: 'p'
	})
	.option('username', {
		alias: 'u'
	}).argv;

var github = new GitHubApi({
	version: '3.0.0'
});

github.authenticate({
	type: 'basic',
	username: argv.username,
	password: argv.password
});

github.repos.create({
	name: argv.name
}, function(error, result) {
	if(error !== null) {
		console.log(error);
		process.exit(1);
	}

	console.log(result['clone_url']);
});
