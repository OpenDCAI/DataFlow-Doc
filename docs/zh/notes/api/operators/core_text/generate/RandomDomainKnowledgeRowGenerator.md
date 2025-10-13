---
title: RandomDomainKnowledgeRowGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/core_text/generate/randomdomainknowledgerowgenerator/
---

## 📘 概述
[RandomDomainKnowledgeRowGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) 算子用于结合系统提示词(system_prompt)和用户自定义提示模板(user_prompt)，批量生成领域知识相关文本内容。该算子可以不依赖输入数据，根据 `generation_num` 参数生成指定数量的内容，也可以利用 `user_prompt` 中的占位符灵活处理输入数据。

## __init__函数
```python
def __init__(self, llm_serving: LLMServingABC, system_prompt: str = "You are a helpful agent.", user_prompt: str = "{}")
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行推理与生成。 |
| **system_prompt** | str | "You are a helpful agent." | 系统提示词，用于定义大语言模型的行为或角色。 |
| **user_prompt** | str | "{}" | 用户提示词模板。可通过`{}`占位符灵活插入输入内容。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
| | | | |

## run函数
```python
def run(self, storage: DataFlowStorage, output_key: str = "generated_content", generation_num: int = 1)
```
执行算子主逻辑，生成领域知识文本，并将结果写回存储。

#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **output_key** | str | "generated_content" | 输出列名，对应生成的领域知识文本字段。 |
| **generation_num** | int | 1 | 在无输入数据时，指定要生成的内容数量。 |

## 🧠 示例用法
```python

```

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| generated_content | str | 模型生成的领域知识文本。 |
