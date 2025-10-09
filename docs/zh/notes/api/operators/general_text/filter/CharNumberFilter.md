---
title: CharNumberFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/charnumberfilter/
---

## 📘 概述

`CharNumberFilter` 算子用于根据字符数量对文本数据进行过滤。它会计算指定文本字段在去除空白字符后的字符总数，并仅保留那些字符数大于或等于预设阈值的记录。

## __init__函数

```python
def __init__(self, threshold: int=100)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :-------------- | :---- | :------ | :----------------------------------------------------------- |
| **threshold** | int | 100 | 最小字符数量阈值。去除空白字符后，文本的字符数必须大于或等于此值才会被保留。 |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='char_number_filter_label')
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :--------------------------- | :--------------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待过滤的文本字段。 |
| **output_key** | str | 'char_number_filter_label' | 输出列名，用于存储过滤结果的标签（1表示通过，0表示未通过）。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

该算子会向输入的 DataFrame 中添加一个由 `output_key` 指定的新列，该列的值为 `1` (通过过滤) 或 `0` (未通过过滤)。最终，算子会将过滤后（即新列值为 `1` 的所有行）的 DataFrame 写回存储。

| 字段 | 类型 | 说明 |
| :--------------------------- | :---- | :--------------------------------------------------- |
| ... (原始输入字段) | ... | 输入 DataFrame 中的所有原始字段。 |
| **[output_key]** | int | 过滤结果标签，`1` 表示字符数满足阈值条件。 |
