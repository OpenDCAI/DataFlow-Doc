---
title: CurlyBracketFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/curlybracketfilter/
---

## 📘 概述

`CurlyBracketFilter` 是一个数据过滤算子，用于检测并过滤掉文本中花括号（`{}`）使用过于频繁的条目。它通过计算花括号数量与总文本长度的比率，并与预设的阈值进行比较，来判断是否需要过滤该条目。

## `__init__`函数

```python
def __init__(self, threshold: float=0.025):
```

### init参数说明

| 参数名        | 类型  | 默认值  | 说明                                                         |
| :------------ | :---- | :------ | :----------------------------------------------------------- |
| **threshold** | float | 0.025   | 花括号数量与文本长度比率的阈值，超过该阈值的文本行将被过滤。 |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='curly_bracket_filter_label'):
```

#### 参数

| 名称          | 类型              | 默认值                       | 说明                                                         |
| :------------ | :---------------- | :--------------------------- | :----------------------------------------------------------- |
| **storage**   | DataFlowStorage   | 必需                         | 数据流存储实例，负责读取与写入数据。                         |
| **input_key** | str               | 必需                         | 输入列名，对应需要检测的文本字段。                           |
| **output_key**| str               | 'curly_bracket_filter_label' | 输出列名，用于存储过滤结果的标签（1 表示通过，0 表示未通过）。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import CurlyBracketFilter
from dataflow.utils.storage import FileStorage

class CurlyBracketFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/curly_bracket_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = CurlyBracketFilter(threshold=0.025)
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='curly_bracket_filter_label'
        )

if __name__ == "__main__":
    test = CurlyBracketFilterTest()
    test.forward()
```

## 🧾 默认输出格式（Output Format）

算子执行后，会向DataFrame中添加一个由`output_key`指定的新列，并过滤掉未通过检测的行。最终写回存储的是过滤后的DataFrame。

| 字段                     | 类型 | 说明                                             |
| :----------------------- | :--- | :----------------------------------------------- |
| text                     | str  | 原始输入文本                                     |
| curly_bracket_filter_label | int  | 过滤标签，值为1表示该行数据通过了花括号比率检测 |

### 📋 示例输入

```json
{"text": "This is normal text without brackets."}
{"text": "Code snippet: {{variable}} and {another} {here} {too} {many} {brackets}"}
```

### 📤 示例输出

```json
{"text": "This is normal text without brackets.", "curly_bracket_filter_label": 1}
```

### 📊 结果分析

**样本1（正常文本）**：
- 文本："This is normal text without brackets."
- 花括号数量：0
- 文本长度：38
- 花括号比率：0/38 = 0.0
- **通过过滤**（≤ 0.025阈值）

**样本2（含大量花括号）**：
- 文本："Code snippet: {{variable}} and {another} {here} {too} {many} {brackets}"
- 花括号数量：12（包括左右括号）
- 文本长度：约75
- 花括号比率：12/75 ≈ 0.16 (16%)
- **未通过过滤**（> 0.025阈值）

**应用场景**：
- 过滤代码片段或模板文本
- 识别并移除包含大量占位符的文本
- 清理爬取数据中的模板残留
- 提高自然语言文本数据的纯净度

**注意事项**：
- 算子计算花括号（`{` 和 `}`）的总数量与文本长度的比率
- 默认阈值0.025表示花括号数量不超过文本长度的2.5%
- 左右花括号都会被计入总数
- 可根据实际应用场景调整阈值
