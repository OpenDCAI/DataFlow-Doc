---
title: RemoveNumberRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/removenumberrefiner/
---

## 📘 概述

[RemoveNumberRefiner](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/refiner/remove_number_refiner.py) 是一个文本清理算子，用于从指定的文本字段中移除所有数字字符（0-9）。它通过遍历文本中的每个字符并过滤掉数字来实现这一功能，从而保留纯文本内容。该算子适用于数据预处理阶段，特别是当需要处理不含数字的自然语言文本时。

## `__init__`函数

```python
def __init__(self)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| 无 | - | - | 该算子在初始化时无需任何参数。 |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，指定要处理的包含文本的字段。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import RemoveNumberRefiner
from dataflow.utils.storage import FileStorage

class RemoveNumberRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/remove_number_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = RemoveNumberRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = RemoveNumberRefinerTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :---- | :---------- |
| text | str | 移除数字后的文本 |

### 📋 示例输入

```json
{"text":"Hello world without numbers."}
{"text":"Born in 1990 and moved in 2020."}
{"text":"Price is $100 for 5 items."}
{"text":"Call me at 123-456-7890."}
{"text":"Room 404, Building 3, Floor 12."}
```

### 📤 示例输出

```json
{"text":"Hello world without numbers."}
{"text":"Born in  and moved in ."}
{"text":"Price is $ for  items."}
{"text":"Call me at --."}
{"text":"Room , Building , Floor ."}
```

### 📊 结果分析

在本测试中，5条输入数据中有4条被修改：

**样本1（无数字）**：
- 原文："Hello world without numbers."
- 不包含数字字符
- **未修改**（保持原样）

**样本2（年份）**：
- 原文："Born in 1990 and moved in 2020."
- 移除所有数字字符 1、9、9、0、2、0、2、0
- 结果："Born in  and moved in ."
- **已修改**

**样本3（价格和数量）**：
- 原文："Price is $100 for 5 items."
- 移除数字 1、0、0、5，保留货币符号和标点
- 结果："Price is $ for  items."
- **已修改**

**样本4（电话号码）**：
- 原文:"Call me at 123-456-7890."
- 移除所有数字，保留连字符和标点
- 结果："Call me at --."
- **已修改**

**样本5（门牌号）**：
- 原文："Room 404, Building 3, Floor 12."
- 移除所有数字 4、0、4、3、1、2
- 结果："Room , Building , Floor ."
- **已修改**

**应用场景**：
- 移除文本中的噪声数字
- 为纯文本分析准备数据
- 隐私保护（移除可能的数字敏感信息）
- 文本规范化处理

**注意事项**：
- 该算子使用 `isdigit()` 方法识别数字字符
- 只移除 0-9 的阿拉伯数字
- 不移除中文数字（如一、二、三）
- 移除数字后可能产生多余空格，建议结合 `RemoveExtraSpacesRefiner` 使用
- 会移除所有数字，包括日期、价格、编号等重要信息，使用前需谨慎评估
