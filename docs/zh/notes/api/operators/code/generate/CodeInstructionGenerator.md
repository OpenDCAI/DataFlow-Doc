---
title: CodeInstructionGenerator
createTime: 2025/11/09 22:49:03
permalink: /zh/api/operators/code/generate/CodeInstructionGenerator/
---

## 📘 概述

[CodeInstructionGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/code/generate/code_gen_instruction.py) 是一个算子，它从数据池中随机抽取few-shot样本,使用大语言模型（LLM）生成类似难度的指令。这是代码领域中 'self-instruct' 风格数据合成管道的第一步。

## __init__函数
```python
class CodeInstructionGenerator(OperatorABC):
    def __init__(self, llm_serving: LLMServingABC, prompt_template=None, num_few_shot: int = 3, num_generate: int = 10):
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行推理与生成。 |
| **prompt_template** | PromptABC \| str \| None | None | 提示词模板对象，用于构建输入。若为None，则使用默认模板；若为字符串，则使用DiyCodePrompt。 |
| **num_few_shot** | int | 3 | 抽取样本用来few-shot的数量。 ｜
| **num_generate** | int | 10 | 生成类似指令的数量。 ｜

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
| **CodeInstructionGeneratePrompt**| 生成新的代码指令 | 基于少量示例创建类似风格的新编程问题 | 基于少量示例生成风格一致的指令，保持难度和复杂度的相似性，确保指令清晰、具体且可解决。 |

## run函数
```python
def run(self, storage: DataFlowStorage, input_key: str = "prompt", output_key: str = "generated_instruction")
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | "prompt" | 输入列名，对应样本指令。 |
| **output_key** | str | "generated_instruction" | 输出列名，对应生成的指令字段。 |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| prompt | str | 输入的指令。 |
| generated_instruction | str | 模型生成的指令。 |

示例输入：
```json
{"prompt": "from typing import List\n\n\ndef has_close_elements(numbers: List[float], threshold: float) -> bool:\n    \"\"\" Check if in given list of numbers, are any two numbers closer to each other than\n    given threshold.\n    >>> has_close_elements([1.0, 2.0, 3.0], 0.5)\n    False\n    >>> has_close_elements([1.0, 2.8, 3.0, 4.0, 5.0, 2.0], 0.3)\n    True\n    \"\"\"\n"}
{"prompt": "from typing import List\n\n\ndef separate_paren_groups(paren_string: str) -> List[str]:\n    \"\"\" Input to this function is a string containing multiple groups of nested parentheses. Your goal is to\n    separate those group into separate strings and return the list of those.\n    Separate groups are balanced (each open brace is properly closed) and not nested within each other\n    Ignore any spaces in the input string.\n    >>> separate_paren_groups('( ) (( )) (( )( ))')\n    ['()', '(())', '(()())']\n    \"\"\"\n"}
{"prompt": "\n\ndef truncate_number(number: float) -> float:\n    \"\"\" Given a positive floating point number, it can be decomposed into\n    and integer part (largest integer smaller than given number) and decimals\n    (leftover part always smaller than 1).\n\n    Return the decimal part of the number.\n    >>> truncate_number(3.5)\n    0.5\n    \"\"\"\n"}

```
示例输出：
```json
{"generated_instruction": "from typing import List\n\n\ndef parse_nested_parens(paren_string: str) -> List[int]:\n    \"\"\" Input to this function is a string represented multiple groups for nested parentheses separated by spaces.\n    For each of the group, output the deepest level of nesting of parentheses.\n    E.g. (()()) has maximum two levels of nesting while ((())) has three.\n\n    >>> parse_nested_parens('(()()) ((())) () ((())()())')\n    [2, 3, 1, 3]\n    \"\"\"\n"}
```
