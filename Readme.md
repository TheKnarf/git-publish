# Git publish

Git publish lets you push your git repo to GitHub, BitBucket or GitLab with a single command, `git publish`.
It uses the corresponding sites API to create a new repo with the name of the current folder you're in.

The command then adds the new repository as a remote to the current repo and pushes the current branch.

## Installation

`npm install -g git-publish`

## Configuration

You can configure which username and password git publish uses with a `.gitpublishrc` file located in your home directory.

The file contains the username and password, and is formatted as json.

Example:

```json
{
  "username": "MyUserName",
  "password": "MyPassword"
}

```

## Usage

`git publish --help`
