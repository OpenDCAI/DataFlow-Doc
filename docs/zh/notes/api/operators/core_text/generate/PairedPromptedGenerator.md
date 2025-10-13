---
title: PairedPromptedGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/core_text/generate/pairedpromptedgenerator/
---

## 📘 概述
`PairedPromptedGenerator` 是一个基于成对输入的提示词生成算子。它读取输入数据中的两列指定字段 (`input_key_1` 和 `input_key_2`)，将它们与一个系统提示词 (`system_prompt`) 组合成一个完整的提示，然后批量调用大语言模型（LLM）服务生成结果。最终，生成的文本将被添加为新的一列 (`output_key`) 写回数据中。

## `__init__`函数
```python
def __init__(self, llm_serving: LLMServingABC, system_prompt: str = "You are a helpful agent."):
```
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行推理与生成。 |
| **system_prompt** | str | "You are a helpful agent." | 系统提示词，用于指导模型的角色与输出风格。 |

### Prompt模板说明



## `run`函数
```python
def run(self, storage: DataFlowStorage, input_key_1: str = "input_key_1", input_key_2: str = 'input_key_2', output_key: str = "generated_content"):
```
| 参数 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key_1** | str | "input_key_1" | 包含第一部分输入内容的列名。 |
| **input_key_2** | str | "input_key_2" | 包含第二部分输入内容的列名。 |
| **output_key** | str | "generated_content" | 存储生成结果的输出列名。 |

## 🧠 示例用法
