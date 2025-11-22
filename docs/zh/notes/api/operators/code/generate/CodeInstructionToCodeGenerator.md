---
title: CodeInstructionToCodeGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/code/generate/codeinstructiontocodegenerator/
---

## 📘 概述
[CodeInstructionToCodeGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) 是一个代码生成算子，用于根据自然语言指令生成相应的代码片段。

## \_\_init\_\_函数
```python
def __init__(self, llm_serving: LLMServingABC, prompt_template=None)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行代码生成。 |
| **prompt_template** | PromptABC \| str \| None | None | 提示词模板对象，用于构建输入。默认为 `CodeInstructionToCodeGeneratorPrompt`，支持自定义模板。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
| | | | |

## run函数
```python
def run(self, storage: DataFlowStorage, input_key: str = "instruction", output_key: str = "generated_code")
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | "instruction" | 输入列名，对应自然语言指令字段。 |
| **output_key** | str | "generated_code" | 输出列名，对应生成的代码片段字段。 |

## 🧠 示例用法
