---
title: ReasoningAnswerModelJudgeFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/reasoning/filter/reasoninganswermodeljudgefilter/
---

## 📘 概述

[ReasoningAnswerModelJudgeFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/judge/reasoning_answer_model_judge_filter.py) 是一个答案正确性评判算子，通过比较待评判答案与参考答案的语义一致性，来判断答案是否正确。该算子调用大语言模型进行语义理解和判断，最终返回每个答案是否正确的二分类结果，并可根据配置筛选出判断正确的样本。

## `__init__`函数

```python
def __init__(self,
             system_prompt: str = "You are a helpful assistant specialized in evaluating answer correctness.",
             llm_serving: LLMServingABC = None,
             prompt_template = AnswerJudgePrompt | DIYPromptABC,
             keep_all_samples: bool = False,
             )
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **system\_prompt** | str | "You are a helpful..." | 定义大语言模型行为的系统提示词。 |
| **llm\_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行推理与生成。 |
| **prompt\_template** | PromptABC | AnswerJudgePrompt | 提示词模板对象，用于构建评判提示词。支持AnswerJudgePrompt或自定义模板。 |
| **keep\_all\_samples** | bool | False | 是否保留所有样本。若为 `False`，则仅保留判断结果为正确的样本。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_question_key: str = "question", input_answer_key: str = "answer", input_reference_key: str = "reference_answer")
```

执行算子主逻辑，从存储中读取包含问题、待评判答案和参考答案的 DataFrame，调用 LLM 进行评判，并将评判结果写回存储。

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input\_question\_key** | str | "question" | 输入数据中问题所在的列名。 |
| **input\_answer\_key** | str | "answer" | 输入数据中待评判答案所在的列名。 |
| **input\_reference\_key** | str | "reference\_answer" | 输入数据中参考答案所在的列名。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| question | str | 输入的问题文本 (由 `input_question_key` 指定)。 |
| answer | str | 输入的待评判答案文本 (由 `input_answer_key` 指定)。 |
| reference\_answer | str | 输入的参考答案文本 (由 `input_reference_key` 指定)。 |
| answer\_match\_result | bool | 模型对答案正确性的评判结果（True 或 False）。 |

示例输入：

```json
{
    "question": "珠穆朗玛峰是世界第几高峰？",
    "answer": "珠穆朗玛峰是世界第一高峰。",
    "reference_answer": "第一"
}
```

示例输出：

```json
{
    "question": "珠穆朗玛峰是世界第几高峰？",
    "answer": "珠穆朗玛峰是世界第一高峰。",
    "reference_answer": "第一",
    "answer_match_result": true
}
```
