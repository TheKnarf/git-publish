#!/usr/bin/env node

var program = require('commander'),
	 exec = require('child_process').exec;

var currentFolderName = require('path').basename(process.cwd());

program
	.version('0.0.1')
	.description('Create a repo on providers like GitHub, Bitbucket or Gitlab and push to it with a single command')
	.option('-P, --provider [GitHub, Bitbucket, GitLab]', 'Change witch provider to use, defaults to GitHub', 'github')
	.option('-N, --name <name>', 'Name for the newly created repo, defaults to directory name', currentFolderName)
//	.option('-D, --description <desc>', 'Discription for the new repo')
//	.option('-U, --user <username>', 'Username for login on the selected provider')
//	.option('--private', 'Publish it as a private repo')
//	.option('--public', 'Publish it as a public repo')
//	.option('--wiki', 'Publish it with a wiki if the provider supports wikis')
//	.option('--issues', 'Publish it with a issue tracker if the provider supports issue trackers')
//	.option('--protocol [https, ssh], 'Decide if you want https or ssh for your git remote if the provider supports it, default is ssh', 'ssh')
//	.option('-I, --interactive', 'Ask for properties like provider and name interactivly', false)
//	.option('--all', 'Publish all local branches', false)

program.parse(process.argv);

var cmd = 'git-publish-provider-' + program.provider.toLowerCase() + ' ' + program.name;

exec(cmd, function(error, stdout, stderr) {
	if(error != null) {
		console.log("Error: ", stderr);
		process.exit(error);
	}

	var git_remote = stdout,
		 cmd_add_remote = 'git remote add origin ' + git_remote,
		 cmd_git_push = 'git push -u origin $(git symbolic-ref HEAD)';

	console.log(cmd_add_remote);
	exec(cmd_add_remote, function(error, stdout, stderr) {
		if(error != null) {
			console.log("Error: ", stderr);
			process.exit(error);
		}

		console.log(cmd_git_push);
		exec(cmd_git_push, function(error, stdout, stderr) {
			if(error != null) {
				console.log("Error: ", stderr);
				process.exit(error);
			}

			console.log(stdout);
		});
	});
});
