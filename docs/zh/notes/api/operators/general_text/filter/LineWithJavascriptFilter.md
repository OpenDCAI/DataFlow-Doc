---
title: LineWithJavascriptFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/linewithjavascriptfilter/
---

## 📘 概述

`LineWithJavascriptFilter` 用于识别并过滤包含 'javascript' 引用的文本行。它通过检查文本中不含 "javascript" 关键词的行数是否达到指定阈值来决定是否保留该条数据。

## __init__函数

```python
def __init__(self, threshold: int=3)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **threshold** | int | 3 | 一个整数阈值。如果文本中不包含"javascript"的行数大于或等于此阈值，则该文本被视为有效。 |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='line_with_javascript_filter_label')
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待过滤的文本字段。 |
| **output_key** | str | 'line_with_javascript_filter_label' | 输出列名，用于存储过滤结果的标签（1表示通过，0表示被过滤）。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import LineWithJavascriptFilter
from dataflow.utils.storage import FileStorage

class LineWithJavascriptFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/line_with_javascript_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = LineWithJavascriptFilter(
            threshold=3
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='line_with_javascript_filter_label'
        )

if __name__ == "__main__":
    test = LineWithJavascriptFilterTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| text | str | 输入的原始文本字段。 |
| line_with_javascript_filter_label | int | 过滤标签（1表示通过，0表示被过滤）。 |

### 📋 示例输入

```json
{"text": "This is a normal text without any JavaScript references."}
{"text": "Line 1: javascript code here\nLine 2: more javascript\nLine 3: javascript again\nLine 4: and javascript"}
{"text": "First line is fine.\nSecond line mentions javascript.\nThird line is ok.\nFourth line is also fine."}
```

### 📤 示例输出

```json
{"text": "This is a normal text without any JavaScript references.", "line_with_javascript_filter_label": 1}
{"text": "First line is fine.\nSecond line mentions javascript.\nThird line is ok.\nFourth line is also fine.", "line_with_javascript_filter_label": 1}
```

### 📊 结果分析

**样本1（无 JavaScript）**：
- 总行数：1
- 不含 "javascript" 的行数：1
- **通过过滤**（≥ 3 阈值或总行数 ≤ 3）

**样本2（大量 JavaScript）**：
- 总行数：4
- 不含 "javascript" 的行数：0
- **未通过过滤**（< 3 阈值且总行数 > 3）

**样本3（少量 JavaScript）**：
- 总行数：4
- 不含 "javascript" 的行数：3
- **通过过滤**（≥ 3 阈值）

**应用场景**：
- 过滤包含大量 JavaScript 代码或引用的文本
- 清除技术文档中的代码片段
- 确保文本内容的纯净性

**注意事项**：
- 算子对 "javascript" 关键词不区分大小写
- 如果文本总行数 ≤ 3，则自动通过
- 如果不含 "javascript" 的行数 ≥ threshold，则通过
- 默认阈值为 3，可根据实际需求调整
