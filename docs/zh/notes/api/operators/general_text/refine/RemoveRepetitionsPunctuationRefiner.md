---
title: RemoveRepetitionsPunctuationRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/removerepetitionspunctuationrefiner/
---

## 📘 概述

[RemoveRepetitionsPunctuationRefiner](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/refiner/remove_repetitions_punctuation_refiner.py) 算子用于移除文本中重复的标点符号，例如将"!!!"变为"!"，",,"变为","。它通过正则表达式匹配连续重复的标点符号，并将其替换为单个符号。

## \_\_init\_\_函数

```python
def __init__()
```

### init参数说明

该算子无需初始化参数。

## run函数

```python
def run(storage, input_key)
```

#### 参数

| 名称          | 类型              | 默认值 | 说明                                     |
| :------------ | :---------------- | :----- | :--------------------------------------- |
| **storage**   | DataFlowStorage   | 必需   | 数据流存储实例，负责读取与写入数据。     |
| **input_key** | str               | 必需   | 输入列名，对应需要处理重复标点的文本字段。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import RemoveRepetitionsPunctuationRefiner
from dataflow.utils.storage import FileStorage

class RemoveRepetitionsPunctuationRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/remove_repetitions_punctuation_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = RemoveRepetitionsPunctuationRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = RemoveRepetitionsPunctuationRefinerTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :---- | :---------- |
| text | str | 移除了重复标点的文本 |

### 📋 示例输入

```json
{"text":"Hello world!!!"}
{"text":"What??? Really!!! Amazing..."}
{"text":"Price is $100,,, okay???"}
```

### 📤 示例输出

```json
{"text":"Hello world!"}
{"text":"What? Really! Amazing."}
{"text":"Price is $100, okay?"}
```

### 📊 结果分析

**样本1**：重复感叹号 "!!!" → "!"

**样本2**：多处重复标点 "???" "!!!" "..." → "?" "!" "."

**样本3**：重复逗号和问号 ",,," "???" → "," "?"

**应用场景**：
- 清理用户输入的过度标点
- 规范化社交媒体文本
- 文本预处理和标准化

**注意事项**：
- 保留标点符号的类型，只移除重复
- 适用于所有 `string.punctuation` 中的标点
