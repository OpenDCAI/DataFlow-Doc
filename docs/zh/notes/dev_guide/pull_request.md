---
title: Github 代码贡献规范
createTime: 2025/06/13 10:42:46
permalink: /zh/dev_guide/pull_request/
---
# GitHub Pull Request 规范

## 一、总体原则

本项目采用 **GitHub Flow** 作为主要协作模式，所有代码修改 **必须通过 Pull Request（PR）** 合并到主分支。

核心原则如下：

* `main`（或 `master`）分支始终保持 **可随时发布**
* **禁止** 直接向官方仓库的 `main` 分支 push
* 每个功能 / 修复都应在 **独立的 feature 分支** 中完成
* 一个 PR 只做 **一件清晰的事情**
* PR 合并后，对应的 feature 分支应被删除

---

## 二、整体流程说明（对应流程图）

![](/github_pr_process.jpg)



整个贡献流程分为 **三个仓库 / 环境角色**：

1. **官方仓库（Official Repo）**
2. **你 Fork 的仓库（Your Forked Repo）**
3. **你的本地工作区（Local Workspace）**

总体来说就是维护个人分支和主仓库分支平行发展。然后每次有新feature就要checkout branch后，加新Feature再发起PR，PR合并后，该分支即弃用。

---

## 三、首次贡献流程（创建第一个 PR）

### 1. Fork 官方仓库

在 GitHub 上：

* 打开官方仓库页面
* 点击右上角 **Fork**
* 在你的账号下生成一个 Fork 仓库

> 后续所有 PR 都是 **从你的 Fork → 官方仓库**

---

### 2. Clone 你的 Fork 到本地

```bash
git clone https://github.com/<your-name>/<repo>.git
cd <repo>
```

默认会得到：

* 本地 `main` 分支
* 远程 `origin` 指向你的 Fork 仓库

---

### 3. 基于 main 创建功能分支

**不要直接在 main 分支开发**

```bash
git checkout main
git pull origin main
git checkout -b feature/xxx
```

分支命名建议：

* `feature/xxx`：新功能
* `fix/xxx`：Bug 修复
* `refactor/xxx`：重构
* `docs/xxx`：文档修改

---

### 4. 开发 & 提交代码

```bash
git add .
git commit -m "feat: xxx 功能说明"
```

提交信息建议遵循 Conventional Commits：

* `feat:` 新功能
* `fix:` Bug 修复
* `docs:` 文档
* `refactor:` 重构
* `chore:` 杂项

---

### 5. 推送分支到你的 Fork

```bash
git push origin feature/xxx
```

---

### 6. 创建 Pull Request

在 GitHub 页面：

* 从 **你的 feature 分支**
* 提交 PR 到 **官方仓库的 main 分支**

PR 描述中应包含：

* 修改背景 / 目的
* 主要改动点
* 是否有破坏性变更
* 关联的 Issue（如有）

---

## 四、PR 审核期间的更新流程（非常重要）

> **只要 PR 还没被合并，就不要新开 PR**

如果需要继续修改：

```bash
# 仍然在同一个 feature 分支
git add .
git commit -m "fix: 根据 review 修改"
git push origin feature/xxx
```

✔ 新提交会 **自动追加到当前 PR**
✘ 不要重新创建 PR

---

## 五、PR 合并后的处理

### 1. 合并完成后

* 官方仓库 `main` 更新
* 你的 Fork 仓库 `main` **不会自动更新**

此时：

> **该 feature 分支已经完成使命，可以删除**

```bash
git branch -d feature/xxx
```

GitHub 页面也可以直接点击 **Delete branch**

---

### 2. 同步官方 main 到你的 Fork（推荐）

在 GitHub 页面：

* 进入你 Fork 的仓库
* 点击 **Sync fork**（或 Update branch）

或者本地方式（推荐高级用户）：

```bash
git remote add upstream https://github.com/<official>/<repo>.git
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

---

## 六、后续再次贡献（第二个 / 第 N 个 PR）

流程与第一次 **完全一致**：

1. 确保本地 `main` 是最新的
2. 从 `main` 新建一个 **新的 feature 分支**
3. 开发 → push → 提 PR
4. 审核 → 合并 → 删除分支

❗ **不要复用已经合并过的 feature 分支**

---

## 七、常见错误 & 注意事项

❌ 错误做法：

* 直接在 `main` 分支开发
* 一个 PR 混合多个不相关修改
* PR 已合并但分支继续复用
* 为了小修改新建多个 PR

✅ 推荐做法：

* 小步提交，PR 聚焦单一目标
* PR 描述清晰，便于 Review
* 合并即清理分支
* 经常同步官方 main

---

## 八、总结（一句话版）

> **Fork 官方仓库 → 本地建 feature 分支 → 提 PR → Review → Merge → 删分支 → 同步 main**
