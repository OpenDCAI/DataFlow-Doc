---
title: CharNumberFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/charnumberfilter/
---

## 📘 概述

`CharNumberFilter` 算子用于根据字符数量对文本数据进行过滤。它会计算指定文本字段在去除空白字符后的字符总数，并仅保留那些字符数大于或等于预设阈值的记录。

## __init__函数

```python
def __init__(self, threshold: int=100)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :-------------- | :---- | :------ | :----------------------------------------------------------- |
| **threshold** | int | 100 | 最小字符数量阈值。去除空白字符（空格、换行、制表符）后，文本的字符数必须大于或等于此值才会被保留。 |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='char_number_filter_label')
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :--------------------------- | :--------------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待过滤的文本字段。 |
| **output_key** | str | 'char_number_filter_label' | 输出列名，用于存储过滤结果的标签（1表示通过，0表示未通过）。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import CharNumberFilter
from dataflow.utils.storage import FileStorage

class CharNumberFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/char_number_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = CharNumberFilter(
            threshold=100
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='char_number_filter_label'
        )

if __name__ == "__main__":
    test = CharNumberFilterTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

该算子会向输入的 DataFrame 中添加一个由 `output_key` 指定的新列，该列的值为 `1` (通过过滤) 或 `0` (未通过过滤)。最终，算子会将过滤后（即新列值为 `1` 的所有行）的 DataFrame 写回存储。

| 字段 | 类型 | 说明 |
| :--------------------------- | :---- | :--------------------------------------------------- |
| text | str | 原始输入文本 |
| **char_number_filter_label** | int | 过滤结果标签，`1` 表示字符数满足阈值条件，`0` 表示不满足。 |

### 📋 示例输入

```json
{"text": "Short"}
{"text": "This is a medium length text that should pass the character count filter with enough characters to meet the threshold."}
{"text": "A"}
{"text": "The quick brown fox jumps over the lazy dog. This sentence contains enough characters to pass the minimum threshold for the character number filter."}
{"text": "x"}
```

### 📤 示例输出

```json
{"text": "The quick brown fox jumps over the lazy dog. This sentence contains enough characters to pass the minimum threshold for the character number filter.", "char_number_filter_label": 1}
```

### 📊 结果分析

**样本1（"Short"）**：
- 去除空白后字符数：5
- **未通过过滤**（< 100阈值）

**样本2（中等长度文本）**：
- 原文：约120字符
- 去除空白后字符数：约100字符
- **通过过滤**（≥ 100阈值）

**样本3（"A"）**：
- 去除空白后字符数：1
- **未通过过滤**（< 100阈值）

**样本4（长文本）**：
- 原文：约157字符
- 去除空白后字符数：约135字符
- **通过过滤**（≥ 100阈值）

**样本5（"x"）**：
- 去除空白后字符数：1
- **未通过过滤**（< 100阈值）

**应用场景**：
- 过滤过短的文本，确保数据质量
- 移除无效或不完整的条目
- 设置最小文本长度要求
- 清洗数据集中的噪声数据

**注意事项**：
- 字符计数会去除所有空格、换行符和制表符
- 中文字符、英文字符、数字、标点符号都计入字符数
- 建议根据具体应用场景调整阈值（默认100适用于段落级文本）
