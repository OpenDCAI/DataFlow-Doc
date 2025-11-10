---
title: CodeEnhancementInstructionGenerator
createTime: 2025/11/10 10:59:28
permalink: /en/api/operators/code/generate/CodeEnhancementInstructionGenerator/
---

# 📘 Overview
[CodeEnhancementInstructionGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/code/generate/code_instruction_enhancement.py) is an operator that uses a large language model (LLM) to enhance human-written instructions by unifying tasks with different output formats into generating complete functions. This is the first step in a 'self-instruct' style data synthesis pipeline for the code domain.

# `__init__`
```python
class CodeEnhancementInstructionGenerator(OperatorABC):
    def __init__(self, llm_serving: LLMServingABC, prompt_template=None):
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | Required | Large language model serving instance for executing inference. |
| **prompt_template** | PromptABC / str | `CodeCodeToInstructionGeneratorPrompt()` | The prompt template object used to construct the input. Supports custom templates via string or `DiyCodePrompt`. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
| **CodeInstructionEnhancement** |  Instruction Standardization and Enhancement | Converts raw code instructions into standardized format | Generates templates containing standardized English instructions and code blocks, enforcing output of Python function templates in specific formats |

# `run`
```python
def run(self, storage: DataFlowStorage, input_key: str = "messages", output_key: str = "generated_instruction")
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | "messages" | Input column name, corresponding to the original instruction field. |
| **output_key** | str | "generated_instruction" | Output column name,  corresponding to the enhanced instruction field.  |

# 🧠 Example Usage

#### 🧾 Default Output Format
| Field | Type | Description |
| :--- | :--- | :--- |
| messages | str | The input instruction snippet. |
| generated_instruction | str | Enhanced model instructions. |

**Example Input:**
```json
{"messages":[{"content":"You are given a Python function and an assertion containing an input to the function. Complete the assertion with a literal (no unsimplified expressions, no function calls) containing the output when executing the provided code on the given input, even if the function is incorrect or incomplete. Do NOT output any extra information. Execute the program step by step before arriving at an answer, and provide the full assertion with the correct output in [ANSWER] and [\/ANSWER] tags, following the examples.\n\n[PYTHON]\ndef performOperation(s):\n    s = s + s\n    return \"b\" + s + \"a\"\nassert performOperation(s = \"hi\") == ??\n[\/PYTHON]\n[THOUGHT]\nLet's execute the code step by step:\n\n1. The function performOperation is defined, which takes a single argument s.\n2. The function is called with the argument \"hi\", so within the function, s is initially \"hi\".\n3. Inside the function, s is concatenated with itself, so s becomes \"hihi\".\n4. The function then returns a new string that starts with \"b\", followed by the value of s (which is now \"hihi\"), and ends with \"a\".\n5. The return value of the function is therefore \"bhihia\".\n[\/THOUGHT]\n[ANSWER]\nassert performOperation(s = \"hi\") == \"bhihia\"\n[\/ANSWER]\n\n[PYTHON]\ndef double_odd_numbers(lst: list) -> list:\n    return [x * 2 if x % 2 != 0 else x for x in lst]\nassert double_odd_numbers(lst=[1, 2, 3, 4, 5]) == ??\n[\/PYTHON]\n[THOUGHT]\n","index":null,"role":"HUMAN"}]}
```
**Example Output:**
```json
{"messages":[{"content":"You are given a Python function and an assertion containing an input to the function. Complete the assertion with a literal (no unsimplified expressions, no function calls) containing the output when executing the provided code on the given input, even if the function is incorrect or incomplete. Do NOT output any extra information. Execute the program step by step before arriving at an answer, and provide the full assertion with the correct output in [ANSWER] and [\/ANSWER] tags, following the examples.\n\n[PYTHON]\ndef performOperation(s):\n    s = s + s\n    return \"b\" + s + \"a\"\nassert performOperation(s = \"hi\") == ??\n[\/PYTHON]\n[THOUGHT]\nLet's execute the code step by step:\n\n1. The function performOperation is defined, which takes a single argument s.\n2. The function is called with the argument \"hi\", so within the function, s is initially \"hi\".\n3. Inside the function, s is concatenated with itself, so s becomes \"hihi\".\n4. The function then returns a new string that starts with \"b\", followed by the value of s (which is now \"hihi\"), and ends with \"a\".\n5. The return value of the function is therefore \"bhihia\".\n[\/THOUGHT]\n[ANSWER]\nassert performOperation(s = \"hi\") == \"bhihia\"\n[\/ANSWER]\n\n[PYTHON]\ndef double_odd_numbers(lst: list) -> list:\n    return [x * 2 if x % 2 != 0 else x for x in lst]\nassert double_odd_numbers(lst=[1, 2, 3, 4, 5]) == ??\n[\/PYTHON]\n[THOUGHT]\n","index":null,"role":"HUMAN"}],"generated_instruction":"Please provide a self-contained Python script that solves the following problem in a markdown code block\n```\n\ndef complete_assertion_with_output(lst: list) -> str:\n    \"\"\" Given a list of integers, complete the assertion by analyzing the function behavior.\n    The function `double_odd_numbers` multiplies odd numbers by 2 and leaves even numbers unchanged.\n    You must execute the function with the given input and provide the output as a literal.\n\n    Input: A list of integers `lst`.\n    Output: A string representing the complete assert statement with the correct output literal.\n\n    Example:\n    >>> complete_assertion_with_output([1, 2, 3, 4, 5])\n    'assert double_odd_numbers(lst=[1, 2, 3, 4, 5]) == [2, 2, 6, 4, 10]'\n    \"\"\"\n```"}
```
