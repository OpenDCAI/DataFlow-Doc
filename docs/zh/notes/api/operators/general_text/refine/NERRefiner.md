---
title: NERRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/nerrefiner/
---

好的，这是根据您提供的代码和模板生成的 `NERRefiner` 算子的教程 Markdown。

---

## 📘 概述

[NERRefiner](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) 是一个命名实体识别（NER）优化算子，利用 `spaCy` 库识别并屏蔽文本中的特定实体（如人名、地名、组织等）。它通过将识别出的实体替换为其类型标签（例如 `[PERSON]`），从而实现数据匿名化或特征提取，适用于数据预处理、隐私保护等场景。

## __init__函数

```python
def __init__(self)
```

该算子在初始化时无需传入任何参数。

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

执行算子主逻辑，从存储中读取输入 DataFrame，对指定列的文本进行实体识别与屏蔽，并将处理后的结果写回存储。

#### 参数

| 名称          | 类型              | 默认值 | 说明                                                         |
| :------------ | :---------------- | :----- | :----------------------------------------------------------- |
| **storage**   | `DataFlowStorage` | 必需   | 数据流存储实例，负责读取与写入数据。                         |
| **input_key** | `str`             | 必需   | 输入列的名称，该列包含需要进行命名实体识别与屏蔽的文本数据。 |

## 🧠 示例用法
