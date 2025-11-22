---
title: ContentNullFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/contentnullfilter/
---

## 📘 概述
`ContentNullFilter` 算子用于过滤数据集中的空值、空字符串或仅包含空白字符的文本，以确保下游处理的数据质量和有效性。

## __init__函数
```python
def __init__(self)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **-** | - | - | 该算子初始化时无需传入参数。 |

## run函数
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='content_null_filter_label')
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :--------------------------- | :------------------------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，指定需要进行空值检查的文本字段。 |
| **output_key** | str | "content_null_filter_label" | 输出列名，用于存储过滤结果的标签（1表示有效，0表示无效）。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import ContentNullFilter
from dataflow.utils.storage import FileStorage

class ContentNullFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/content_null_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = ContentNullFilter()
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='content_null_filter_label'
        )

if __name__ == "__main__":
    test = ContentNullFilterTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :--------------------------- | :---- | :---------------------------------- |
| text | str | 原始输入文本字段 |
| content_null_filter_label | int | 过滤标签，值为1表示该行数据有效并通过了过滤 |

### 📋 示例输入

```json
{"text": "This is a valid sentence."}
{"text": ""}
{"text": "   "}
{"text": "Another valid one."}
```

### 📤 示例输出

```json
{"text": "This is a valid sentence.", "content_null_filter_label": 1}
{"text": "Another valid one.", "content_null_filter_label": 1}
```

### 📊 结果分析

在本测试中，4条输入数据中有2条通过过滤：

**样本1（有效文本）**：
- 文本："This is a valid sentence."
- 包含有效内容
- **保留**（content_null_filter_label=1）

**样本2（空字符串）**：
- 文本：""（空字符串）
- **过滤**（不在输出中）

**样本3（空白字符）**：
- 文本："   "（仅包含空格）
- **过滤**（不在输出中）

**样本4（有效文本）**：
- 文本："Another valid one."
- 包含有效内容
- **保留**（content_null_filter_label=1）

**应用场景**：
- 数据清洗，移除空值和无效数据
- 确保下游处理的数据质量
- 预处理阶段去除噪声数据
- 保证文本字段的有效性

**注意事项**：
- 该算子会同时过滤 `None`、空字符串 `""`、仅包含空白字符的字符串
- 使用 `str.strip()` 方法检测是否为空白字符
- 是数据处理流程中的基础过滤算子
