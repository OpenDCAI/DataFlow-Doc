---
title: 安装
icon: material-symbols-light:download-rounded
createTime: 2025/06/09 10:29:31
permalink: /zh/guide/install/
---
# 安装
本节介绍如何安装DataFlow。
- 如果你仅想快速使用DataFlow中提供的Pipeline和算子，请参考[普通用户安装](#普通用户安装)，安装pypi发布的稳定正式版。
- 如果你想使用我们正在开发的版本，或作为开发者向DataFlow仓库贡献代码，请参考[开发者安装](#开发者安装)，安装Github仓库中的dev版。

## 普通用户安装
如果你没有GPU做本地推理环境，仅需使用API和CPU功能，则配置Python环境并安装DataFlow正式版👇

```shell
pip install open-dataflow
```

如果想用本地GPU实现推理，则根据你期望的后端是vllm/sglang，使用如下命令：
```shell
pip install open-dataflow[vllm]
```

```shell
pip install open-dataflow[sglang]
```

> Dataflow 支持Python>=3.10的环境，具体依赖可能随着vllm和SGLang版本号有新的约束。

安装完成后，你可以用如下指令检查安装是否正确：
```shell
dataflow -v
```

如果安装正常，且DataFlow是最新的Release版，则会看到:
```log
open-dataflow codebase version: 0.0.2
        Checking for updates...
        Local version:  0.0.2
        PyPI newest version:  0.0.2
You are using the latest version: 0.0.2.
```
具体最新版本号最新版也可参考[Github Release](https://github.com/OpenDCAI/DataFlow/releases) 和 [Pypi官网](https://pypi.org/project/open-dataflow/).

此外，我们也提供了`dataflow env`命令行指令用于查看当前硬件软件环境。运行后，会输出类似如下的内容：
```shell
========================================================================================

- `dataflow` version: 1.0.5
- Platform: Linux-5.15.0-58-generic-x86_64-with-glibc2.35
- Python version: 3.10.10
- PyTorch version: 2.6.0+metax2.33.1.4 (GPU)
- Torchvision version: 2.6.0+metax2.33.1.4
- GPU type: MetaX C500
- GPU number: 8
- GPU memory: 63.62GB
- vLLM version: 0.8.5
- Git commit: 2135405b509a72cd11beed7be5f29ce50274d288

========================================================================================
```
## 开发者安装

DataFlow开发者可以通过以下指令安装:

如果不需要本地GPU推理
```shell
git clone https://github.com/OpenDCAI/DataFlow
cd DataFlow
pip install -e .
```

如果想用本地GPU实现推理，则根据你期望的后端是vllm/sglang，使用如下命令：
```shell
git clone https://github.com/OpenDCAI/DataFlow
cd DataFlow
pip install -e .[vllm]
```
```shell
git clone https://github.com/OpenDCAI/DataFlow
cd DataFlow
pip install -e .[sglang]
```

> Dataflow 支持Python>=3.10的环境，具体依赖可能随着vllm和SGLang版本号有新的约束。

安装完成后，你可以用如下指令检查安装是否正确：
```shell
dataflow -v
```

如果安装正常，且DataFlow是最新的Release版，则会看到:
```log
open-dataflow codebase version: 0.0.2
        Checking for updates...
        Local version:  0.0.2
        PyPI newest version:  0.0.2
You are using the latest version: 0.0.2.
```
具体最新版本号最新版也可参考[Github Release](https://github.com/OpenDCAI/DataFlow/releases) 和 [Pypi官网](https://pypi.org/project/open-dataflow/).

此外，我们也提供了`dataflow env`命令行指令用于查看当前硬件软件环境。运行后，会输出类似如下的内容：
```shell
========================================================================================

- `dataflow` version: 1.0.5
- Platform: Linux-5.15.0-58-generic-x86_64-with-glibc2.35
- Python version: 3.10.10
- PyTorch version: 2.6.0+metax2.33.1.4 (GPU)
- Torchvision version: 2.6.0+metax2.33.1.4
- GPU type: MetaX C500
- GPU number: 8
- GPU memory: 63.62GB
- vLLM version: 0.8.5
- Git commit: 2135405b509a72cd11beed7be5f29ce50274d288

========================================================================================
```

这样，你在本地对DataFlow包进行的修改都可以实时更新到你的python环境中，方便开发。当开发完成后，也可以提PR向主仓库贡献你的新算子和新流水线。

