---

title: GitHub Code Contribution Guidelines
createTime: 2025/06/13 10:42:46
permalink: /en/dev_guide/pull_request/
--------------------------------------

# GitHub Pull Request Guidelines

## 1. General Principles

This project adopts **GitHub Flow** as the primary collaboration model. All code changes **must be merged into the main branch via Pull Requests (PRs)**.

Core principles:

* The `main` (or `master`) branch must always be **deployable**
* **Direct pushes** to the official repository’s `main` branch are **not allowed**
* Each feature or fix must be developed in an **independent feature branch**
* Each PR should address **one clear and focused change**
* After a PR is merged, the corresponding feature branch should be deleted

---

## 2. Overall Workflow Overview (Corresponding to the Diagram)

![](/github_pr_process.jpg)

The entire contribution process involves **three repositories / environments**:

1. **Official Repository**
2. **Your Forked Repository**
3. **Your Local Workspace**

In general, your personal branches and the main repository branch evolve in parallel.
For each new feature, you must check out a new branch, implement the feature, and then open a PR.
Once the PR is merged, the branch should be abandoned and no longer reused.

---

## 3. First-Time Contribution Workflow (Creating Your First PR)

### 1. Fork the Official Repository

On GitHub:

* Open the official repository page
* Click **Fork** in the top-right corner
* A forked repository will be created under your account

> All subsequent PRs will be created **from your fork → the official repository**

---

### 2. Clone Your Fork Locally

```bash
git clone https://github.com/<your-name>/<repo>.git
cd <repo>
```

By default, you will have:

* A local `main` branch
* A remote named `origin` pointing to your forked repository

---

### 3. Create a Feature Branch from main

**Do not develop directly on the main branch**

```bash
git checkout main
git pull origin main
git checkout -b feature/xxx
```

Recommended branch naming conventions:

* `feature/xxx`: New features
* `fix/xxx`: Bug fixes
* `refactor/xxx`: Refactoring
* `docs/xxx`: Documentation changes

---

### 4. Develop & Commit Code

```bash
git add .
git commit -m "feat: description of xxx feature"
```

Commit messages are recommended to follow **Conventional Commits**:

* `feat:` New features
* `fix:` Bug fixes
* `docs:` Documentation
* `refactor:` Refactoring
* `chore:` Maintenance or miscellaneous tasks

---

### 5. Push the Branch to Your Fork

```bash
git push origin feature/xxx
```

---

### 6. Create a Pull Request

On the GitHub page:

* Select **your feature branch**
* Open a PR targeting the **official repository’s main branch**

The PR description should include:

* Background / purpose of the change
* Key modifications
* Whether there are any breaking changes
* Related issues (if any)

---

## 4. Updating Code During PR Review (Very Important)

> **As long as the PR has not been merged, do not create a new PR**

If further changes are required:

```bash
# Stay on the same feature branch
git add .
git commit -m "fix: update based on review feedback"
git push origin feature/xxx
```

✔ New commits will be **automatically appended to the existing PR**
✘ Do not create a new PR

---

## 5. After the PR Is Merged

### 1. After Merge Completion

* The official repository’s `main` branch is updated
* Your fork’s `main` branch **will not be updated automatically**

At this point:

> **The feature branch has completed its purpose and can be deleted**

```bash
git branch -d feature/xxx
```

You can also click **Delete branch** directly on the GitHub PR page.

---

### 2. Sync the Official main Branch to Your Fork (Recommended)

On GitHub:

* Go to your forked repository
* Click **Sync fork** (or **Update branch**)

Or via local commands (recommended for advanced users):

```bash
git remote add upstream https://github.com/<official>/<repo>.git
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

---

## 6. Subsequent Contributions (Second / Nth PR)

The workflow is **exactly the same** as the first time:

1. Ensure your local `main` branch is up to date
2. Create a **new feature branch** from `main`
3. Develop → push → open PR
4. Review → merge → delete branch

❗ **Do not reuse feature branches that have already been merged**

---

## 7. Common Mistakes & Notes

❌ Incorrect practices:

* Developing directly on the `main` branch
* Mixing multiple unrelated changes in one PR
* Reusing a branch after its PR has been merged
* Creating multiple PRs for trivial changes

✅ Recommended practices:

* Make small, incremental commits with focused PRs
* Write clear and descriptive PR descriptions
* Delete branches immediately after merge
* Frequently sync with the official `main` branch

---

## 8. Summary (One Sentence)

> **Fork the official repository → create a feature branch locally → open a PR → review → merge → delete the branch → sync main**
