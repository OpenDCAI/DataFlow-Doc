---
title: ReasoningPretrainFormatConvertGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/reasoning/generate/reasoningpretrainformatconvertgenerator/
---

## 📘 概述
[ReasoningPretrainFormatConvertGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_pretrain_format_convert_generator.py) 是一个数据格式转换算子，用于将监督微调（SFT）格式的数据（通常是问答对）转换为预训练（Pre-training）格式。它通过将问题（Question）和答案（Answer）字段拼接成一个单一的文本字段来实现这一转换，以便于后续的预训练任务。

## `__init__`函数
```python
def __init__(self)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
|        |      |      | 无可配置参数。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`函数
```python
def run(self, storage: DataFlowStorage, input_read_key_question: str = "question", input_read_key_answer: str = "answer", output_key: str = "text")
```

#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_read_key_question** | str | "question" | 输入数据中表示问题的列名。 |
| **input_read_key_answer** | str | "answer" | 输入数据中表示答案的列名。 |
| **output_key** | str | "text" | 输出数据中拼接后文本的列名。 |

## 🧠 示例用法
```python

```

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| text | str | 由问题和答案拼接而成的文本。 |

示例输入：
```json
{
"question":"中国的首都是哪里？",
"answer":"中国的首都是北京。"
}
```
示例输出：
```json
{
"text":"中国的首都是哪里？\n中国的首都是北京。"
}
```
