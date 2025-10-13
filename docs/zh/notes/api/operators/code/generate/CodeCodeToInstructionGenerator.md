---
title: CodeCodeToInstructionGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/code/generate/codecodetoinstructiongenerator/
---

## 📘 概述

[CodeCodeToInstructionGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) 是一个算子，它使用大语言模型（LLM）根据给定的代码片段生成人类可读的指令。这是代码领域中 'self-instruct' 风格数据合成管道的第一步。

## __init__函数
```python
class CodeCodeToInstructionGenerator(OperatorABC):
    def __init__(self, llm_serving: LLMServingABC, prompt_template=None):
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行推理与生成。 |
| **prompt_template** | PromptABC \| str \| None | None | 提示词模板对象，用于构建输入。若为None，则使用默认模板；若为字符串，则使用DiyCodePrompt。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
| | | | |

## run函数
```python
def run(self, storage: DataFlowStorage, input_key: str = "code", output_key: str = "generated_instruction")
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | "code" | 输入列名，对应代码片段字段。 |
| **output_key** | str | "generated_instruction" | 输出列名，对应生成的指令字段。 |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| code | str | 输入的代码片段。 |
| generated_instruction | str | 模型生成的指令。 |

示例输入：
```json
{
"code": "def is_prime(n):\n    if n <= 1:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True"
}
```
示例输出：
```json
{
"code": "def is_prime(n):\n    if n <= 1:\n        return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0:\n            return False\n    return True",
"generated_instruction": "Write a Python function to check if a given number is a prime number."
}
```
