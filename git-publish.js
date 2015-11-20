#!/usr/bin/env node

var program = require('commander');

program
	.version('0.0.1')
	.option('-P, --provider [GitHub, Bitbucket, GitLab]', 'Change witch provider to use, defaults to GitHub')
	.option('-N, --name <name>', 'Name for the newly created repo, defaults to directory name')
	.option('-U, --user <username>', 'Username for the provider')

	

program.parse(process.argv);

//if (!program.args.length) program.help();

