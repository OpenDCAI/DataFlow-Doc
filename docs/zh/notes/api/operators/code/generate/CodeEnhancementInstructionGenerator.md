---
title: CodeEnhancementInstructionGenerator
createTime: 2025/11/09 22:46:36
permalink: /zh/api/operators/code/generate/CodeEnhancementInstructionGenerator/
---

## 📘 概述

[CodeEnhancementInstructionGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/code/generate/code_instruction_enhancement.py) 是一个算子，它使用大语言模型（LLM）增强人类指令，将不同输出格式的任务统一为生成完整函数。这是代码领域中 'self-instruct' 风格数据合成管道的第一步。

## __init__函数
```python
class CodeEnhancementInstructionGenerator(OperatorABC):
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
| **CodeInstructionEnhancement** | 指令标准化与增强 | 将原始代码指令转换为标准化格式 | 生成包含标准化英文指令和代码块的模板，强制要求输出特定格式的Python函数模板|

## run函数
```python
def run(self, storage: DataFlowStorage, input_key: str = "input", output_key: str = "generated_instruction")
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | "input" | 输入列名，对应原始指令字段。 |
| **output_key** | str | "generated_instruction" | 输出列名，对应增强后的指令字段。 |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| input | str | 输入的人类指令 |
| generated_instruction | str | 模型增强后的指令 |

示例输入：
```json
{"instruction": "", "input": "You are given a Python function and an assertion containing an input to the function. Complete the assertion with a literal (no unsimplified expressions, no function calls) containing the output when executing the provided code on the given input, even if the function is incorrect or incomplete. Do NOT output any extra information. Execute the program step by step before arriving at an answer, and provide the full assertion with the correct output in [ANSWER] and [/ANSWER] tags, following the examples.\n\n[PYTHON]\ndef performOperation(s):\n    s = s + s\n    return \"b\" + s + \"a\"\nassert performOperation(s = \"hi\") == ??\n[/PYTHON]\n[THOUGHT]\nLet's execute the code step by step:\n\n1. The function performOperation is defined, which takes a single argument s.\n2. The function is called with the argument \"hi\", so within the function, s is initially \"hi\".\n3. Inside the function, s is concatenated with itself, so s becomes \"hihi\".\n4. The function then returns a new string that starts with \"b\", followed by the value of s (which is now \"hihi\"), and ends with \"a\".\n5. The return value of the function is therefore \"bhihia\".\n[/THOUGHT]\n[ANSWER]\nassert performOperation(s = \"hi\") == \"bhihia\"\n[/ANSWER]\n\n[PYTHON]\ndef double_odd_numbers(lst: list) -> list:\n    return [x * 2 if x % 2 != 0 else x for x in lst]\nassert double_odd_numbers(lst=[1, 2, 3, 4, 5]) == ??\n[/PYTHON]\n[THOUGHT]\n", "output": "Let's execute the code step by step:\n\n1. The function `double_odd_numbers` is defined, which takes a list `lst` as an argument.\n2. The function is called with the argument `[1, 2, 3, 4, 5]`, so within the function, `lst` is `[1, 2, 3, 4, 5]`.\n3. A list comprehension is used to iterate through each element `x` in `lst`.\n   - For `x = 1`: `1 % 2 != 0` is `True`, so `1 * 2 = 2`.\n   - For `x = 2`: `2 % 2 != 0` is `False`, so `x` remains `2`.\n   - For `x = 3`: `3 % 2 != 0` is `True`, so `3 * 2 = 6`.\n   - For `x = 4`: `4 % 2 != 0` is `False`, so `x` remains `4`.\n   - For `x = 5`: `5 % 2 != 0` is `True`, so `5 * 2 = 10`.\n4. The resulting list from the comprehension is `[2, 2, 6, 4, 10]`.\n5. The function returns this list: `[2, 2, 6, 4, 10]`.\n\nThe output of the function based on the input `[1, 2, 3, 4, 5]` is `[2, 2, 6, 4, 10]`.\n\n[ANSWER]\nassert double_odd_numbers(lst=[1, 2, 3, 4, 5]) == [2, 2, 6, 4, 10]\n[/ANSWER]"}
```
示例输出：
```json
{"instruction":"","input":"You are given a Python function and an assertion containing an input to the function. Complete the assertion with a literal (no unsimplified expressions, no function calls) containing the output when executing the provided code on the given input, even if the function is incorrect or incomplete. Do NOT output any extra information. Execute the program step by step before arriving at an answer, and provide the full assertion with the correct output in [ANSWER] and [\/ANSWER] tags, following the examples.\n\n[PYTHON]\ndef performOperation(s):\n    s = s + s\n    return \"b\" + s + \"a\"\nassert performOperation(s = \"hi\") == ??\n[\/PYTHON]\n[THOUGHT]\nLet's execute the code step by step:\n\n1. The function performOperation is defined, which takes a single argument s.\n2. The function is called with the argument \"hi\", so within the function, s is initially \"hi\".\n3. Inside the function, s is concatenated with itself, so s becomes \"hihi\".\n4. The function then returns a new string that starts with \"b\", followed by the value of s (which is now \"hihi\"), and ends with \"a\".\n5. The return value of the function is therefore \"bhihia\".\n[\/THOUGHT]\n[ANSWER]\nassert performOperation(s = \"hi\") == \"bhihia\"\n[\/ANSWER]\n\n[PYTHON]\ndef double_odd_numbers(lst: list) -> list:\n    return [x * 2 if x % 2 != 0 else x for x in lst]\nassert double_odd_numbers(lst=[1, 2, 3, 4, 5]) == ??\n[\/PYTHON]\n[THOUGHT]\n","output":"Let's execute the code step by step:\n\n1. The function `double_odd_numbers` is defined, which takes a list `lst` as an argument.\n2. The function is called with the argument `[1, 2, 3, 4, 5]`, so within the function, `lst` is `[1, 2, 3, 4, 5]`.\n3. A list comprehension is used to iterate through each element `x` in `lst`.\n   - For `x = 1`: `1 % 2 != 0` is `True`, so `1 * 2 = 2`.\n   - For `x = 2`: `2 % 2 != 0` is `False`, so `x` remains `2`.\n   - For `x = 3`: `3 % 2 != 0` is `True`, so `3 * 2 = 6`.\n   - For `x = 4`: `4 % 2 != 0` is `False`, so `x` remains `4`.\n   - For `x = 5`: `5 % 2 != 0` is `True`, so `5 * 2 = 10`.\n4. The resulting list from the comprehension is `[2, 2, 6, 4, 10]`.\n5. The function returns this list: `[2, 2, 6, 4, 10]`.\n\nThe output of the function based on the input `[1, 2, 3, 4, 5]` is `[2, 2, 6, 4, 10]`.\n\n[ANSWER]\nassert double_odd_numbers(lst=[1, 2, 3, 4, 5]) == [2, 2, 6, 4, 10]\n[\/ANSWER]","generated_instruction":"Please provide a self-contained Python script that solves the following problem in a markdown code block\n```\n\ndef complete_assertion_with_literal(lst: list) -> str:\n    \"\"\" Given a Python function that doubles odd numbers in a list, complete the assertion with a literal.\n    The input is a list of integers, and the output is a formatted string representing the correct assertion.\n    Constraints: The assertion must not contain unsimplified expressions or function calls.\n    Provide at least one doctest example:\n    >>> complete_assertion_with_literal([1, 2, 3, 4, 5])\n    'assert double_odd_numbers(lst=[1, 2, 3, 4, 5]) == [2, 2, 6, 4, 10]'\n    \"\"\"\n```"}
```
