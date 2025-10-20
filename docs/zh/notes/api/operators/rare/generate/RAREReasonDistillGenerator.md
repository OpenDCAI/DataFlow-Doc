---
title: RAREReasonDistillGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/rare/generate/rarereasondistillgenerator/
---

## 📘 概述 RAREReasonDistillGenerator
RAREReasonDistillGenerator 是一个推理蒸馏算子。它通过结合问题、场景、一个正例文档和多个困难负例文档作为输入，来提示大语言模型（LLM）生成详细的、逐步的思维过程，从而蒸馏出其推理能力。

## \_\_init\_\_函数
```python
def __init__(self, llm_serving: LLMServingABC):
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行推理与生成。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
| | | | |

## run函数
```python
def run(storage, input_text_key="text", input_question_key="question", input_scenario_key="scenario", input_hardneg_key="hard_negatives", output_key="reasoning")
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_text_key** | str | "text" | 输入列名，包含正面文档的字段名。 |
| **input_question_key** | str | "question" | 输入列名，包含问题的字段名。 |
| **input_scenario_key** | str | "scenario" | 输入列名，包含情景的字段名。 |
| **input_hardneg_key** | str | "hard_negatives" | 输入列名，包含困难负样本列表的字段名。 |
| **output_key** | str | "reasoning" | 输出列名，用于存储生成的推理过程。 |

## 🧠 示例用法
```python

```
#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| | | |
