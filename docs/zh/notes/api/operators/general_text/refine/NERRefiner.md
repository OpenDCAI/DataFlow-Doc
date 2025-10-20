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

```python
from dataflow.operators.general_text import NERRefiner
from dataflow.utils.storage import FileStorage

class NERRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/ner_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = NERRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = NERRefinerTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :---- | :---------- |
| text | str | 命名实体被标签替换后的文本 |

### 📋 示例输入

```json
{"text":"Apple Inc. is located in California"}
{"text":"John Smith works at Microsoft"}
{"text":"Visit Paris next summer"}
```

### 📤 示例输出

```json
{"text":"[ORG] is located in [GPE]"}
{"text":"[PERSON] works at [ORG]"}
{"text":"Visit [GPE] [DATE]"}
```

### 📊 结果分析

**样本1**："Apple Inc." → [ORG]（组织），"California" → [GPE]（地理政治实体）
**样本2**："John Smith" → [PERSON]（人名），"Microsoft" → [ORG]（组织）
**样本3**："Paris" → [GPE]（地理政治实体），"next summer" → [DATE]（日期）

**应用场景**：
- 隐私保护和数据脱敏
- 文本匿名化
- 信息提取预处理
- 敏感信息屏蔽

**注意事项**：
- 使用 spaCy 的 en_core_web_sm 模型
- 支持多种实体类型：PERSON、ORG、GPE、LOC、DATE、MONEY 等
- 仅适用于英文文本
