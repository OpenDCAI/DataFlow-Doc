---
title: TextNormalizationRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/textnormalizationrefiner/
---

## 📘 概述

[TextNormalizationRefiner]() 是一个文本规范化算子，用于统一文本数据中的日期和货币格式。该算子将多种常见的日期表示形式（如 `MM/DD/YYYY`、`Month DD, YYYY`）转换为标准的 `YYYY-MM-DD` 格式，并将美元货币表示（如 `$50`）转换为 `50 USD` 格式，从而提高数据的规整性和一致性。

## \_\_init\_\_函数

```python
def __init__(self)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :----- | :--- | :----- | :--- |
| **无** | -    | -      | 该算子无需初始化参数。 |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

#### 参数

| 名称          | 类型              | 默认值 | 说明                               |
| :------------ | :---------------- | :----- | :--------------------------------- |
| **storage**   | DataFlowStorage   | 必需   | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str               | 必需   | 输入列名，对应待规范化的文本字段。   |

## 🧠 示例用法

```python
from dataflow.operators.general_text import TextNormalizationRefiner
from dataflow.utils.storage import FileStorage

class TextNormalizationRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/text_normalization_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = TextNormalizationRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = TextNormalizationRefinerTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :---- | :---------- |
| text | str | 日期和货币格式规范化后的文本 |

### 📋 示例输入

```json
{"text":"Event on 12/25/2024 at $50"}
{"text":"Meeting on January 15, 2025"}
{"text":"Cost: $100, Discount: $20"}
```

### 📤 示例输出

```json
{"text":"Event on 2024-25-12 at 50 USD"}
{"text":"Meeting on 2025-01-15"}
{"text":"Cost: 100 USD, Discount: 20 USD"}
```

### 📊 结果分析

**样本1**：日期 "12/25/2024" → "2024-25-12"，货币 "$50" → "50 USD"
**样本2**：日期 "January 15, 2025" → "2025-01-15"
**样本3**：多个货币 "$100" "$20" → "100 USD" "20 USD"

**应用场景**：
- 统一日期格式
- 规范化货币表示
- 数据标准化

**注意事项**：
- 日期转换为 YYYY-MM-DD 格式
- 货币转换为"金额 USD"格式
