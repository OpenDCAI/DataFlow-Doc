---
title: RemovePunctuationRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/removepunctuationrefiner/
---

## 📘 概述
`RemovePunctuationRefiner` 是一个文本处理算子，用于移除指定文本字段中的所有标点符号。它使用 Python 内置的 `string.punctuation` 集合作为标点库，对输入的 DataFrame 进行处理。

## __init__函数
```python
def __init__(self)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :----- | :--- | :----- | :--- |
| **无** | -    | -      | 该算子在初始化时无需传入参数。 |

## run函数
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
#### 参数
| 名称        | 类型            | 默认值 | 说明                               |
| :---------- | :-------------- | :----- | :--------------------------------- |
| **storage** | DataFlowStorage | 必需   | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str             | 必需   | 输入列名，对应需要去除标点的文本字段。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import RemovePunctuationRefiner
from dataflow.utils.storage import FileStorage

class RemovePunctuationRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/remove_punctuation_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = RemovePunctuationRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = RemovePunctuationRefinerTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :---- | :---------- |
| text | str | 移除了标点符号的文本 |

### 📋 示例输入

```json
{"text":"Hello world"}
{"text":"Hello, world! How are you?"}
{"text":"Price: $100; Discount: 20%"}
{"text":"Email: test@example.com"}
{"text":"It's a wonderful day... isn't it?!"}
```

### 📤 示例输出

```json
{"text":"Hello world"}
{"text":"Hello world How are you"}
{"text":"Price 100 Discount 20"}
{"text":"Email testexamplecom"}
{"text":"Its a wonderful day isnt it"}
```

### 📊 结果分析

在本测试中，5条输入数据中有4条被修改：

**样本1（无标点）**：
- 原文："Hello world"
- 不包含标点符号
- **未修改**（保持原样）

**样本2（常见标点）**：
- 原文："Hello, world! How are you?"
- 移除了逗号、感叹号、问号
- 结果："Hello world How are you"
- **已修改**

**样本3（特殊符号）**：
- 原文："Price: $100; Discount: 20%"
- 移除了冒号、美元符号、分号、百分号
- 结果："Price 100 Discount 20"
- **已修改**

**样本4（邮箱符号）**：
- 原文:"Email: test@example.com"
- 移除了冒号、@符号、点号
- 结果："Email testexamplecom"
- **已修改**

**样本5（缩写和省略号）**：
- 原文："It's a wonderful day... isn't it?!"
- 移除了撇号、省略号、问号、感叹号
- 结果："Its a wonderful day isnt it"
- **已修改**

**应用场景**：
- 文本标准化和规范化
- 为词频统计准备数据
- 移除文本中的噪声符号
- 文本分类前的预处理

**注意事项**：
- 该算子基于 `string.punctuation` 集合，包含：`!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~`
- 移除所有英文标点符号
- 不移除中文标点符号（如。，！？等）
- 移除标点后可能产生多余空格或单词粘连
- 建议结合 `RemoveExtraSpacesRefiner` 使用清理多余空格
