#!/usr/bin/env node

var GitHubApi = require("github");
var prompt = require('prompt');

prompt.start();

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
	})
	.option('private', {
		alias: 'P',
		default: false
	}).option('otpCode', {
        alias: 'o'
    }).argv;


var github = new GitHubApi({
    version: '3.0.0'
});

github.authenticate({
    type: 'basic',
    username: argv.username,
    password: argv.password
});

if (argv.otpCode) {
    requestArguments["headers"] = { "X-GitHub-OTP":  argv.otpCode };
}

github.repos.create(requestArguments, function (error, result) {
    if (error !== null) {
        if (missingOtpCode(error)) {
            console.log("Missing OTP code");
        } else {
            console.error(error["message"]);
        }
        process.exit(1);
    } else {
        console.log(result['clone_url']);
    }
});

function missingOtpCode(error) {
    return (error.code === 401
        && JSON.parse(error.message).message === "Must specify two-factor authentication OTP code.");
};

