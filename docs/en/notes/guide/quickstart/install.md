---
title: Installation
icon: material-symbols-light:download-rounded
createTime: 2025/06/09 10:29:31
permalink: /en/guide/install/
---

# Installation

This section describes the two common ways to install DataFlow.  
**Which one you choose depends on whether you are a user or a developer.**

- **General users (recommended)**: You just want to use existing pipelines and operators  
  → Install the **stable release from PyPI**
- **Developers / early adopters**: You want the latest features or plan to contribute to DataFlow  
  → **Clone from GitHub and install in editable (dev) mode**

---

## Option 1: General Users (PyPI Stable Release)

Recommended for **quick start and day-to-day usage**, with no need to modify the source code.

### Install

API / CPU only:
```shell
pip install open-dataflow
```

Local GPU inference (choose your backend):

```shell
pip install open-dataflow[vllm]
```

```shell
pip install open-dataflow[sglang]
```

> DataFlow requires Python ≥ 3.10. GPU-related dependencies may vary with vLLM or SGLang versions.

### Verify Installation

```shell
dataflow -v
```

Example output (version may differ):

```log
open-dataflow codebase version: 0.0.2
Checking for updates...
You are using the latest version: 0.0.2.
```

---

## Option 2: Developers (GitHub Clone + Editable Install)

Recommended if you want to **modify the source code, develop new operators, or submit pull requests**.
With this setup, any local changes take effect immediately.

### Install

CPU only:

```shell
git clone https://github.com/OpenDCAI/DataFlow
cd DataFlow
pip install -e .
```

Local GPU inference (choose your backend):

```shell
pip install -e .[vllm]
```

```shell
pip install -e .[sglang]
```

> Python ≥ 3.10 is required.

### Verify Installation

```shell
dataflow -v
```

---

## Check Runtime Environment (All Install Methods)

Regardless of how you install DataFlow, you can inspect your current software and hardware environment with:

```shell
dataflow env
```

Example output:

```shell
- dataflow version: 1.0.5
- Python version: 3.10.10
- PyTorch version: 2.6.0 (GPU)
- GPU type: MetaX C500
- vLLM version: 0.8.5
- Git commit: 2135405b509a72cd11beed7be5f29ce50274d288
```

---

### Which Should You Choose?

* ✅ **Just use DataFlow** → PyPI install (simple & stable)
* 🛠️ **Develop, extend, or contribute** → GitHub clone + editable install

Pick the option that fits your workflow and start building with DataFlow 🚀
