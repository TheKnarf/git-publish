#!/usr/bin/env node

const findUp = require('find-up');
const fs = require('fs');
const configPath = findUp.sync(['.gitpublishrc', '.gitpublishrc.json']);
const config = configPath ? JSON.parse(fs.readFileSync(configPath)) : {};
const yargs = require('yargs');
var prompt = require('prompt');

prompt.start();

var currentFolderName = require('path').basename(process.cwd());

var arguments = yargs
    .config(config)
    .option('name', {
        alias: 'N',
        default: currentFolderName
    })
    .option('provider', {
        alias: 'P',
        default: 'github'
    })
    .option('private', {
        default: false
    });

// If the config object is empty
if (Object.keys(config).length === 0) {
    arguments = arguments
        .demandOption(['username', 'password'])
        .option('username', {
            alias: 'u'
        })
        .option('password', {
            alias: 'p'
        });
}

const argv = arguments.argv;

var exec = require('child_process').exec;
var cmd = 'git-publish-provider-'
    + argv.provider.toLowerCase()
    + ' -n ' + argv.name
    + ' -u ' + argv.username
    + ' -p ' + argv.password
    + (argv.private ? ' -P ' : '');

exec(cmd, handleOutputFromProvider);

function handleOutputFromProvider(error, stdout, stderr) {
    // Check if the request requires OTP
    if (stdout.indexOf("Missing OTP code" >= 0)) {

        // Prompt the user for the OTP code
        var otpCodePrompt = {
            name: 'otpCode',
            description: 'Enter your one-time password (OTP)',
            pattern: /^\d{6}$/,
            message: 'OTP Code should be 6 numbers'
        };

        return prompt.get([otpCodePrompt], function (error, result) {
            cmd = cmd + ' -o ' + result.otpCode;

            // Restart command, without this check
            return exec(cmd, createRemoteAndPush);
        });
    }

    return createRemoteAndPush(error, stdout, stderr);
}

function createRemoteAndPush(error, stdout, stderr) {
    if (error) {
        console.log("Error: ", stderr);
        process.exit(1);
    }
    var git_remote = stdout,
        cmd_add_remote = 'git remote add origin ' + git_remote,
        cmd_git_push = 'git push -u origin $(git symbolic-ref HEAD)';

    console.log(cmd_add_remote);
    exec(cmd_add_remote, function (error, stdout, stderr) {
        if (error !== null) {
            console.log("Error: ", stderr);
            process.exit(error);
        }

        console.log(cmd_git_push);
        exec(cmd_git_push, function (error, stdout, stderr) {
            if (error !== null) {
                console.log("Error: ", stderr);
                process.exit(error);
            }

            console.log(stdout);
        });
    });
}