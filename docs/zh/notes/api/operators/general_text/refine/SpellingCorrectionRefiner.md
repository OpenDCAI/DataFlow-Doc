---
title: SpellingCorrectionRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/spellingcorrectionrefiner/
---

## 📘 概述

[SpellingCorrectionRefiner](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/refine/spelling_correction_refiner.py) 算子使用 SymSpell 算法对文本中的拼写错误进行纠正。它支持自定义最大编辑距离和词典路径，如果本地词典不存在，则会自动下载。该算子通过高效的近似字符串匹配技术，实现对大规模文本数据的快速拼写纠错。

## `__init__`函数

```python
def __init__(self, max_edit_distance: int = 2, prefix_length: int = 7, dictionary_path: str = "frequency_dictionary_en_82_765.txt")
```

### `init`参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **max_edit_distance** | int | 2 | 进行拼写查找时允许的最大编辑距离（删除、插入、替换、换位）。 |
| **prefix_length** | int | 7 | 用于索引和快速查找的词条前缀长度，以提高性能。 |
| **dictionary_path** | str | "frequency_dictionary_en_82_765.txt" | 拼写纠错所使用的词典文件路径。如果文件不存在，算子会自动从默认URL下载。 |

## Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

执行算子主逻辑，从存储中读取输入 DataFrame，对指定列进行拼写纠错，并将结果写回存储。

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应需要进行拼写纠错的文本字段。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

该算子会直接修改输入 DataFrame 中 `input_key` 对应的列，不会新增列。

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| `<input_key>` | str | 经过拼写纠错后的文本。 |

**示例输入：**

```json
{
    "text": "this is a testt sentance"
}
```

**示例输出：**

```json
{
    "text": "this is a test sentence"
}
```
