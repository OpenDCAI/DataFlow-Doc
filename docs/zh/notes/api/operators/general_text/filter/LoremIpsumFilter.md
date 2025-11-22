---
title: LoremIpsumFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/loremipsumfilter/
---

## 📘 概述

`LoremIpsumFilter` 是一个用于检测并过滤包含"lorem ipsum"等占位文本的算子。它通过计算占位文本出现的频率与文本总长度的比率，并与设定的阈值进行比较，来判断文本是否有效，从而实现对数据集的清洗。

## __init__函数

```python
def __init__(self, threshold: float=3e-8):
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :-- | :-- | :-- | :-- |
| **threshold** | float | 3e-8 | 用于判断是否过滤文本的频率阈值。当占位文本出现的频率与文本总长度的比率超过此阈值时，该文本将被过滤。 |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='loremipsum_filter_label')
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :-- | :-- | :-- | :-- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待检测的文本字段。 |
| **output_key** | str | 'loremipsum_filter_label' | 输出列名，用于存储过滤标签（1表示通过，0表示被过滤）。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import LoremIpsumFilter
from dataflow.utils.storage import FileStorage

class LoremIpsumFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/lorem_ipsum_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = LoremIpsumFilter(
            threshold=3e-8
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='loremipsum_filter_label'
        )

if __name__ == "__main__":
    test = LoremIpsumFilterTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :-- | :-- | :-- |
| [input_key] | str | 输入的原始文本内容。 |
| loremipsum_filter_label | int | 过滤标签，值为1，表示该行数据通过了过滤。 |

### 📋 示例输入

```json
{"text": "This is a valid text entry that should pass the filter without any issues."}
{"text": "lorem ipsum dolor sit amet, consectetur adipiscing elit lorem ipsum lorem ipsum lorem ipsum lorem ipsum"}
{"text": "This is normal text. No placeholder content here."}
```

### 📤 示例输出

```json
{"text": "This is a valid text entry that should pass the filter without any issues.", "loremipsum_filter_label": 1}
{"text": "This is normal text. No placeholder content here.", "loremipsum_filter_label": 1}
```

### 📊 结果分析

**样本1（正常文本）**：
- 文本长度：76 字符
- "lorem ipsum" 出现次数：0
- 频率比率：0 / 76 = 0
- 阈值：3e-8
- **通过过滤**（0 ≤ 3e-8）

**样本2（包含大量占位文本）**：
- 文本长度：105 字符
- "lorem ipsum" 出现次数：5
- 频率比率：5 / 105 ≈ 0.0476
- 阈值：3e-8
- **未通过过滤**（0.0476 > 3e-8）

**样本3（正常文本）**：
- 文本长度：47 字符
- "lorem ipsum" 出现次数：0
- 频率比率：0 / 47 = 0
- 阈值：3e-8
- **通过过滤**（0 ≤ 3e-8）

**应用场景**：
- 清洗网页爬取数据中的占位文本
- 过滤包含模板文本的低质量内容
- 数据集质量控制
- 预训练语料清洗

**注意事项**：
- 该算子使用正则表达式 `r"lorem ipsum"` 进行不区分大小写的匹配
- 计算公式：ratio = 出现次数 / 文本长度
- 只要文本中出现 "lorem ipsum"，几乎一定会被过滤（因为默认阈值极小）
- 阈值越大，过滤条件越宽松
