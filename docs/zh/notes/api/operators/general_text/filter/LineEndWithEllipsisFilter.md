---
title: LineEndWithEllipsisFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/lineendwithellipsisfilter/
---

## 📘 概述

`LineEndWithEllipsisFilter` 是一个数据过滤算子，用于检测文本中以省略号（`...` 或 `…`）结尾的行的比例。当这个比例低于预设阈值时，该文本被视为有效数据并保留，否则将被过滤掉。此算子常用于数据清洗，以识别并移除不完整的表述。

## `__init__`函数

```python
def __init__(self, threshold: float=0.3)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **threshold** | float | 0.3 | 浮点数阈值。如果文本中以省略号结尾的行的比例小于此阈值，则该文本通过筛选。 |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'line_end_with_ellipsis_filter_label')
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应需要进行检测的文本字段。 |
| **output_key** | str | 'line_end_with_ellipsis_filter_label' | 输出列名，用于存储过滤结果的标签（1表示通过，0表示未通过）。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import LineEndWithEllipsisFilter
from dataflow.utils.storage import FileStorage

class LineEndWithEllipsisFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/line_end_with_ellipsis_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = LineEndWithEllipsisFilter(
            threshold=0.3
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='line_end_with_ellipsis_filter_label'
        )

if __name__ == "__main__":
    test = LineEndWithEllipsisFilterTest()
    test.forward()
```

## 🧾 默认输出格式（Output Format）

该算子会向DataFrame中添加一个由 `output_key` 指定的新列，用于标记过滤结果（1代表通过，0代表不通过），并最终只将通过筛选的行（即标记为1的行）写回存储。

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| text | str | 原始输入文本 |
| line_end_with_ellipsis_filter_label | int | 过滤标签（1表示通过，0表示未通过） |

### 📋 示例输入

```json
{"text": "This is a complete sentence without any issues."}
{"text": "This is incomplete...\nAnother line that ends with...\nAnd one more..."}
{"text": "First line is fine.\nSecond line is also good.\nThird line is complete too."}
```

### 📤 示例输出

```json
{"text": "This is a complete sentence without any issues.", "line_end_with_ellipsis_filter_label": 1}
{"text": "First line is fine.\nSecond line is also good.\nThird line is complete too.", "line_end_with_ellipsis_filter_label": 1}
```

### 📊 结果分析

**样本1（完整文本）**：
- 总行数：1
- 以省略号结尾的行数：0
- 省略号行比率：0/1 = 0.0 (0%)
- **通过过滤**（< 0.3 阈值）

**样本2（大量省略号）**：
- 总行数：3
- 以省略号结尾的行数：3
- 省略号行比率：3/3 = 1.0 (100%)
- **未通过过滤**（≥ 0.3 阈值）

**样本3（无省略号）**：
- 总行数：3
- 以省略号结尾的行数：0
- 省略号行比率：0/3 = 0.0 (0%)
- **通过过滤**（< 0.3 阈值）

**应用场景**：
- 过滤不完整的表述或未完成的文本
- 清除包含大量省略号的低质量内容
- 确保文本的完整性和表述的完整性

**注意事项**：
- 算子会检测两种省略号格式：`...` 和 `…`
- 按行分割文本进行检测
- 阈值默认为 0.3，可根据实际需求调整
