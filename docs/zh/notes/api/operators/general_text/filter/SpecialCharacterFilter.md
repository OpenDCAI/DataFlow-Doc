---
title: SpecialCharacterFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/specialcharacterfilter/
---

## 📘 概述

`SpecialCharacterFilter` 是一个特殊字符过滤算子，用于移除文本中包含特定或非标准 Unicode 字符的条目。该算子通过预定义的正则表达式模式来检测并过滤文本，以确保数据的规范性和清洁度。

## `__init__`函数

```python
def __init__(self)
```

### `init`参数说明

该算子在初始化时无需传入参数。

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='special_character_filter_label')
```

执行算子主逻辑，从存储中读取输入 DataFrame，对指定列进行特殊字符检测，过滤不合规的行，并将结果写回存储。

#### 参数

| 名称         | 类型              | 默认值                             | 说明                                                         |
| :----------- | :---------------- | :--------------------------------- | :----------------------------------------------------------- |
| **storage**  | DataFlowStorage   | 必需                               | 数据流存储实例，负责读取与写入数据。                         |
| **input_key**| str               | 必需                               | 输入列名，对应需要进行特殊字符检测的文本字段。               |
| **output_key** | str               | "special_character_filter_label"   | 输出标签列名，用于标记文本是否通过检测（1 表示通过，0 表示未通过）。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import SpecialCharacterFilter
from dataflow.utils.storage import FileStorage

class SpecialCharacterFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/special_char_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = SpecialCharacterFilter()
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='special_character_filter_label'
        )

if __name__ == "__main__":
    test = SpecialCharacterFilterTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段                             | 类型 | 说明                                                   |
| :------------------------------- | :--- | :----------------------------------------------------- |
| [input_key]                      | str  | 输入的原始文本。                                       |
| special_character_filter_label   | int  | 特殊字符检测标签，1 表示文本不含特殊字符，通过检测。   |

### 📋 示例输入

```json
{"text": "This is a normal text without special characters."}
{"text": "This text contains special char u200e which should be filtered."}
{"text": "Another normal text with standard punctuation!"}
```

### 📤 示例输出

```json
{"text": "This is a normal text without special characters.", "special_character_filter_label": 1}
{"text": "Another normal text with standard punctuation!", "special_character_filter_label": 1}
```

### 📊 结果分析

**样本1（正常文本）**：
- 检测模式：`r"u200e"`, `r"&#247;|\? :"`, `r"[�□]|\{\/U\}"`, `r"U\+26[0-F][0-D]|..."`
- 匹配结果：无匹配
- **通过过滤**（不含特殊字符）

**样本2（包含 u200e）**：
- 检测模式匹配：检测到 "u200e"
- **未通过过滤**（包含特殊字符）

**样本3（标准标点）**：
- 检测模式：无匹配
- **通过过滤**（标准标点符号不算特殊字符）

**检测的特殊字符类型**：
- Unicode 控制字符（如 u200e）
- HTML 实体（如 &#247;）
- 损坏字符（如 �、□）
- Unicode 表情符号范围（如 U+2600-U+273F）

**应用场景**：
- 清洗网页爬取的数据
- 过滤包含异常 Unicode 字符的文本
- 数据规范化处理
- 确保文本兼容性

**注意事项**：
- 使用预定义的正则表达式模式检测
- 空文本会被过滤
- 标准标点符号不会被视为特殊字符
- 可以根据需求自定义特殊字符模式
