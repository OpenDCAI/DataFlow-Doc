---
title: LineStartWithBulletpointFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/linestartwithbulletpointfilter/
---

## 📘 概述

`LineStartWithBulletpointFilter` 是一个文本过滤算子，用于检测并过滤那些以项目符号（如 `•`, `*`, `-` 等）开头的行在文本中占比较高的内容。它通过计算项目符号行的比例并与设定的阈值进行比较，来判断是否保留该文本。

## __init__函数

```python
def __init__(self, threshold: float=0.9)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :---------- | :---- | :------ | :----------------------------------------------------------- |
| **threshold** | float | 0.9 | 项目符号行的比率阈值。如果文本中项目符号行的比例超过此值，则该条数据将被过滤。 |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='line_start_with_bullet_point_filter_label')
```

### run参数说明

| 名称 | 类型 | 默认值 | 说明 |
| :----------- | :---------------- | :------------------------------------------- | :------------------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应需要进行过滤检查的文本字段。 |
| **output_key** | str | "line_start_with_bullet_point_filter_label" | 输出列名，用于存储过滤结果的标签（1 表示通过，0 表示未通过）。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import LineStartWithBulletpointFilter
from dataflow.utils.storage import FileStorage

class LineStartWithBulletpointFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/line_start_with_bulletpoint_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = LineStartWithBulletpointFilter(
            threshold=0.9
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='line_start_with_bullet_point_filter_label'
        )

if __name__ == "__main__":
    test = LineStartWithBulletpointFilterTest()
    test.forward()
```

## 🧾 默认输出格式（Output Format）

该算子会向DataFrame中添加一个由 `output_key` 指定的新列，用于存放过滤标签。最终写入存储的DataFrame只包含通过过滤的数据（即 `output_key` 列值为1的行）。

| 字段 | 类型 | 说明 |
| :------------------------------------------- | :--- | :------------------------------------------------------------------- |
| text | str | 输入的原始文本字段。 |
| **line_start_with_bullet_point_filter_label** | int | 过滤结果标签（1表示通过，0表示未通过）。 |

### 📋 示例输入

```json
{"text": "This is normal text without any bullet points. It should pass the filter."}
{"text": "• First item\n• Second item\n• Third item\n• Fourth item\n• Fifth item"}
{"text": "Normal paragraph here.\n• One bullet point\nAnother normal line."}
```

### 📤 示例输出

```json
{"text": "This is normal text without any bullet points. It should pass the filter.", "line_start_with_bullet_point_filter_label": 1}
{"text": "Normal paragraph here.\n• One bullet point\nAnother normal line.", "line_start_with_bullet_point_filter_label": 1}
```

### 📊 结果分析

**样本1（无项目符号）**：
- 总行数：1
- 以项目符号开头的行数：0
- 项目符号行比率：0/1 = 0.0 (0%)
- **通过过滤**（≤ 0.9 阈值）

**样本2（全是项目符号）**：
- 总行数：5
- 以项目符号开头的行数：5
- 项目符号行比率：5/5 = 1.0 (100%)
- **未通过过滤**（> 0.9 阈值）

**样本3（少量项目符号）**：
- 总行数：3
- 以项目符号开头的行数：1
- 项目符号行比率：1/3 ≈ 0.33 (33%)
- **通过过滤**（≤ 0.9 阈值）

**应用场景**：
- 过滤以列表形式呈现的低质量内容
- 清除主要由项目符号构成的文本
- 确保文本是完整的段落而非简单列表

**注意事项**：
- 算子检测多种项目符号：`•`、`‣`、`▶`、`▷`、`◆`、`■`、`□` 等
- 阈值默认为 0.9，意味着如果超过 90% 的行以项目符号开头则过滤
- 适合过滤主要由列表项组成的文本
