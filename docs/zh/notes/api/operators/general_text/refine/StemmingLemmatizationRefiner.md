---
title: StemmingLemmatizationRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/stemminglemmatizationrefiner/
---

好的，这是根据您提供的代码和模板生成的 `StemmingLemmatizationRefiner` 算子的教程 Markdown。

---

## 📘 概述

[StemmingLemmatizationRefiner](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/refine/stemming_lemmatization_refiner.py) 算子用于对文本进行词干提取（Stemming）或词形还原（Lemmatization）处理，将文本中的词语转换为其基本或词根形式。这有助于文本标准化，减少词汇的变体，从而提高后续处理任务的性能。该算子支持 Porter 词干提取算法和 WordNet 词形还原方法。

## __init__函数

```python
def __init__(self, method: str = "stemming"):
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **method** | str | "stemming" | 指定处理方法。可选值为 'stemming'（词干提取）或 'lemmatization'（词形还原）。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
|---|---|---|---|
| | | | |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str):
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，指定了 DataFrame 中需要进行处理的文本字段。 |

## 🧠 示例用法

```python

```

#### 🧾 默认输出格式（Output Format）

该算子会直接修改 `input_key` 指定的列，将处理后的文本写回原位，不会新增列。

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| [input_key] | str | 经过词干提取或词形还原处理后的文本。 |
| ... | any | 输入数据中的其他字段保持不变。 |

**示例输入：**
```json
{
"text": "The cats are running and the mice were playing."
}
```

**示例输出（当 `method="stemming"` 时）：**
```json
{
"text": "the cat are run and the mice were play."
}
```
