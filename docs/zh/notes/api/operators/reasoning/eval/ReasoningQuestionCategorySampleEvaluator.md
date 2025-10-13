---
title: ReasoningQuestionCategorySampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/reasoning/eval/reasoningquestioncategorysampleevaluator/
---

## 📘 概述
`ReasoningQuestionCategorySampleEvaluator` 算子用于对用户问题进行多级分类（主分类和子分类）。通过大语言模型对输入问题进行语义分析，输出分类编码结果。

## `__init__`函数
```python
def __init__(self, llm_serving: LLMServingABC = None)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **llm_serving** | LLMServingABC | None | 大语言模型服务实例，用于执行推理与生成。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
| | | | |

## `run`函数
```python
def run(self, storage: DataFlowStorage, input_key:str = "instruction", output_key:str="question_category")
```

#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | "instruction" | 输入列名，对应问题字段。 |
| **output_key** | str | "question_category" | 输出列名的基础键名，用于校验是否存在同名字段。 |

## 🧠 示例用法
```python

```

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| instruction | str | 输入的问题文本。 |
| primary_category | str | 模型生成的主分类。 |
| secondary_category | str | 模型生成的子分类。 |
