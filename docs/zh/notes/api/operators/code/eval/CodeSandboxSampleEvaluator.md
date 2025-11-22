---
title: CodeSandboxSampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/code/eval/codesandboxsampleevaluator/
---

## 📘 概述 [CodeSandboxSampleEvaluator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py)

CodeSandboxSampleEvaluator 是一个代码沙箱评估算子，它在一个安全、隔离的环境中执行代码片段，以验证其正确性。该算子利用强大的 PythonExecutor 来处理进程隔离、超时和结果捕获，是数据综合流程中的最终验证步骤。

## `__init__`函数

```python
def __init__(self, language: str = "python", timeout_length: int = 15, use_process_isolation: bool = True):
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **language** | str | "python" | 指定要执行的代码语言。 |
| **timeout_length** | int | 15 | 每个代码片段的最大执行时间（秒）。 |
| **use_process_isolation** | bool | True | 是否在单独的进程中运行代码以确保安全。建议保持为 True。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_status_key: str = "sandbox_status", output_log_key: str = "sandbox_log"):
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应包含待执行代码的字段。 |
| **output_status_key** | str | "sandbox_status" | 输出列名，用于存储执行状态（'PASS' 或 'FAIL'）。 |
| **output_log_key** | str | "sandbox_log" | 输出列名，用于存储执行日志或错误信息。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| *input_key* | str | 输入的待执行代码文本。 |
| sandbox_status | str | 代码执行状态，'PASS' 或 'FAIL'。 |
| sandbox_log | str | 代码执行的输出日志或错误信息。 |

示例输入：

```json

```

示例输出：

```json

```
