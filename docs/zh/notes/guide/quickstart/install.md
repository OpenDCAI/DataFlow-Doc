---
title: 安装
icon: material-symbols-light:download-rounded
createTime: 2025/06/09 10:29:31
permalink: /zh/guide/install/
---

# 安装

本节介绍 DataFlow 的两种常见安装方式。**选择哪一种，取决于你是“使用者”还是“开发者”。**

- **普通用户（推荐）**：只想直接使用 DataFlow 已有的 Pipeline 和算子  
  → 使用 **PyPI 安装稳定版**  
- **开发者 / 尝鲜用户**：希望体验最新开发功能，或参与 DataFlow 开发  
  → 使用 **GitHub Clone + 可编辑安装（dev 模式）**

---

## 安装方式一：普通用户（PyPI 稳定版）

适合**快速上手、直接使用**，不关心源码改动。

### 安装

仅使用 API 或 CPU：
```shell
pip install open-dataflow
```

使用本地 GPU 推理（按后端选择）：

```shell
pip install open-dataflow[vllm]
```

```shell
pip install open-dataflow[sglang]
```

> DataFlow 支持 Python >= 3.10，GPU 相关依赖可能随 vLLM / SGLang 版本变化。

### 验证安装

```shell
dataflow -v
```

示例输出（版本号以实际为准）：

```log
open-dataflow codebase version: 0.0.2
Checking for updates...
You are using the latest version: 0.0.2.
```

---

## 安装方式二：开发者（GitHub Clone + dev 模式）

适合**二次开发、调试源码、提交 PR**。
这种方式下，你对 DataFlow 源码的修改会**实时生效**。

### 安装

仅使用 CPU：

```shell
git clone https://github.com/OpenDCAI/DataFlow
cd DataFlow
pip install -e .
```

使用本地 GPU 推理（按后端选择）：

```shell
pip install -e .[vllm]
```

```shell
pip install -e .[sglang]
```

> 同样要求 Python >= 3.10。

### 验证安装

```shell
dataflow -v
```

---

## 环境信息查看（通用）

无论哪种安装方式，都可以使用以下命令查看当前软硬件环境：

```shell
dataflow env
```

示例输出：

```shell
- dataflow version: 1.0.5
- Python version: 3.10.10
- PyTorch version: 2.6.0 (GPU)
- GPU type: MetaX C500
- vLLM version: 0.8.5
- Git commit: 2135405b509a72cd11beed7be5f29ce50274d288
```

---

### 如何选择？

* ✅ **只用、不改代码** → PyPI 安装（简单、稳定）
* 🛠️ **要改源码 / 写新算子 / 提 PR** → GitHub Clone + `pip install -e .`

选择适合你的方式即可开始使用 DataFlow 🚀
