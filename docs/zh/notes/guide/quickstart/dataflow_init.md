---
title: 快速上手-dataflow init
createTime: 2025/06/30 19:19:16
permalink: /zh/guide/dataflow_init/
icon: solar:flag-2-broken
---
# 快速开始

## 代码生成的运行方式

DataFlow 采用**代码生成 + 自定义修改 + 运行脚本**的使用方式，类似 [`create-react-app`](https://github.com/facebook/create-react-app)/[`vue-cli`](https://cli.vuejs.org/)。即通过命令行调用，自动生成默认的运行脚本和入口Python文件，经过用户定制化修改后（比如更换数据集，使用不同的大模型API，重新排列算子），运行该Python文件以执行相应功能。

你只需要三步即可跑起我们提供的SoTA Pipeline。

## 1. 初始化项目

在一个**空目录**中执行：

```bash
dataflow init
```

即会在当前工作路径生成这些文件夹：

```shell
$ tree -L 1
.
|-- api_pipelines
|-- core_text
|-- cpu_pipelines
|-- example_data
|-- gpu_pipelines
|-- playground
`-- simple_text_pipelines
```

**各目录用途：**

* `cpu_pipelines`：仅使用 CPU 的 Pipeline
* `core_text`: DataFlow最基础的几个算子的样例
* `api_pipelines`：使用在线大模型 API（推荐新手）
* `gpu_pipelines`：使用本地 GPU 模型
* `example_data`：所有示例 Pipeline 的默认输入数据
* `playground`：轻量示例，不构成完整 Pipeline
* `simple_text_pipelines`:

---

## 2. Pipeline 分类说明（选一个就好）

同名 Pipeline 在不同目录下是**包含关系**：

| 目录              | 依赖资源             |
| ----------------- | -------------------- |
| `cpu_pipelines` | 仅 CPU               |
| `api_pipelines` | CPU + 大模型 API     |
| `gpu_pipelines` | CPU + API + 本地 GPU |

> 新手推荐：**直接从 `api_pipelines` 开始**

后续如果你有 GPU，只需要把 `LLMServing` 换成本地模型即可。

---

## 3. 运行你的第一个 Pipeline

进入任意 Pipeline 目录，例如：

```bash
cd api_pipelines
```

打开其中的 Python 文件，你通常只需要关注两处配置：

### （1）输入数据路径

```python
self.storage = FileStorage(
    first_entry_file_name="<path_to_dataset>"
)
```

这里默认指向了我们提供的样例数据集，可以直接运行，你可以把它改成你自己的数据集路径来推理自己的数据。

---

### （2）大模型 Serving

如果使用 API，需要先设置环境变量：

**Linux / macOS**

```bash
export DF_API_KEY=sk-xxxxx
```

**Windows CMD**

```cmd
set DF_API_KEY=sk-xxxxx
```

**PowerShell**

```powershell
$env:DF_API_KEY="sk-xxxxx"
```

然后直接运行脚本即可：

```bash
python xxx_pipeline.py
```

---

## 4. 多 API Serving（可选）

如果你需要同时使用多个大模型 API，可以为每个 Serving 指定不同的环境变量名：

```python
llm_serving_openai = APILLMServing_request(
    api_url="https://api.openai.com/v1/chat/completions",
    key_name_of_api_key="OPENAI_API_KEY",
    model_name="gpt-4o"
)

llm_serving_deepseek = APILLMServing_request(
    api_url="https://api.deepseek.com/v1/chat/completions",
    key_name_of_api_key="DEEPSEEK_API_KEY",
    model_name="deepseek-chat"
)
```

然后在环境变量里输出对应的字段名（比如 `OPENAI_API_KEY=sk-xxxxx`）即可实现多API Serving共存。
