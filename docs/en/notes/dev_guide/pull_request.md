---
title: Pull Request Guidelines
createTime: 2025/06/13 10:42:46
permalink: /en/dev_guide/pull_request/
---

# Pull Request Guidelines

Before starting development, please fork this repository to your own GitHub account and clone it to your local machine.

After cloning, set the upstream repository to the main DataFlow repo:

```
git remote add upstream <DataFlow URL>
```

Before submitting your changes, sync your local repository with the upstream repository:

```
git pull upstream main
```

After syncing, push your changes:

```
git push origin main
```

Once your changes are pushed to your forked repository, create a pull request.

If you're not familiar with Git operations, please follow these guidelines:

1. `git add`: Add modified files/folders one by one using `git add <file>`. **Do not use** `git add .`. If this command takes too long, it’s **very likely you’ve added large files to the staging area**. Stop immediately and check.

2. `git commit`: Make your commit messages as clear and accurate as possible.

3. `git push`: When pushing, specify the remote repository and branch. If you're unsure, run `git remote -v` before pushing to confirm the URL of each remote alias.

4. Creating a PR: Before submitting a PR, click on `Files changed` and carefully check whether there are any files that should not be included in the submission.
