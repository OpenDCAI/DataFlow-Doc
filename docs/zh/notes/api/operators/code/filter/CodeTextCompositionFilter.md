---
title: CodeTextCompositionFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/code/filter/codetextcompositionfilter/
---

## 📘 概述
[CodeTextCompositionFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/filters/code_text_composition_filter.py) 是一个基于字符组成的代码过滤算子。它利用 `CodeTextCompositionSampleEvaluator` 对代码样本进行评分，旨在移除二进制文件、加密内容以及其他不可读的文本，确保数据质量。

## `__init__`函数
```python
def __init__(self, min_score: float = 1.0, max_score: float = 1.0)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **min_score** | float | 1.0 | 最小字符组成得分阈值，低于此值的样本将被过滤。 |
| **max_score** | float | 1.0 | 最大字符组成得分阈值，高于此值的样本将被过滤。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| --- | --- | --- | --- |
| | | | |

## `run`函数
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'text_composition_filter_label')
```
执行算子主逻辑，从存储中读取输入 DataFrame，根据字符组成得分进行过滤，并将过滤后的结果写回存储。

#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，该列应包含代码文本`'text'`和编程语言`'language'`信息。 |
| **output_key** | str | "text\_composition\_filter\_label" | 输出标签列名，用于存储过滤结果（1表示保留，0表示过滤）。 |

## 🧠 示例用法
```python
 
```

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| ... | | 输入的原始字段。 |
| CodeTextCompositionScore | float | 字符组成综合得分（0-1），1表示通过检查。 |
| text\_composition\_filter\_label | int | 过滤标签，1 表示样本通过过滤，0 表示被过滤。 |

示例输入：
```json
{
    "text": "def hello_world():\n    print(\"Hello, World!\")",
    "language": "python"
}
```
示例输出：
```json
{
    "text": "def hello_world():\n    print(\"Hello, World!\")",
    "language": "python",
    "alphabetic_character_ratio": 0.75,
    "alphanumeric_character_ratio": 0.8,
    "CodeTextCompositionScore": 1.0,
    "text_composition_filter_label": 1
}
```
