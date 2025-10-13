---
title: CodeQualitySampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/code/eval/codequalitysampleevaluator/
---

## 📘 概述
`CodeQualitySampleEvaluator` 是一个代码质量评估算子，用于评估生成的代码片段与其源指令的匹配质量。它利用大语言模型（LLM）提供数值分数和文本反馈，充当自动化代码审查员。

## `__init__`函数
```python
def __init__(self, llm_serving: LLMServingABC, prompt_template=None):
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行评估。 |
| **prompt_template** | PromptABC | None | 提示词模板对象，用于构建评估提示词。若为None，则使用默认的`CodeQualityEvaluatorPrompt`。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
| | | | |

## `run`函数
```python
def run(self, storage: DataFlowStorage, input_key: str, output_score_key: str = "quality_score", output_feedback_key: str = "quality_feedback"):
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，该列包含指令与代码对。 |
| **output_score_key** | str | "quality_score" | 输出列名，用于存储质量分数。 |
| **output_feedback_key** | str | "quality_feedback" | 输出列名，用于存储质量反馈。 |

## 🧠 示例用法
