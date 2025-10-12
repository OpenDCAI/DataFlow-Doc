---
title: NoPuncFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/nopuncfilter/
---

## 📘 概述

`NoPuncFilter` 用于过滤文本，确保文本中的句子长度不超过设定的阈值。它会遍历文本中的每个句子，计算其单词数量，并过滤掉包含超长句子的条目。

## __init__函数
```python
def __init__(self, threshold: int=112)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :---------- | :--- | :---- | :----------------------------- |
| **threshold** | int | 112 | 句子最大单词数的阈值。 |

## run函数
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='no_punc_filter_label')
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :----------- | :---------------- | :------------------------- | :------------------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待检查的文本字段。 |
| **output_key** | str | 'no_punc_filter_label' | 输出列名，用于存储过滤结果的标签。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import NoPuncFilter
from dataflow.utils.storage import FileStorage

class NoPuncFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/no_punc_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = NoPuncFilter(
            threshold=112
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='no_punc_filter_label'
        )

if __name__ == "__main__":
    test = NoPuncFilterTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）
算子执行后，会在原始数据中增加一个`output_key`指定的列（默认为`no_punc_filter_label`），其值为1代表数据通过了过滤检查。最终，算子会筛选出所有检查通过的数据行并写回存储。
| 字段 | 类型 | 说明 |
| :----------------------- | :---- | :----------------------------------------------------------- |
| no_punc_filter_label | int | 过滤结果标签。值为1表示该行文本中所有句子的长度均未超过阈值。 |

### 📋 示例输入

```json
{"text": "This is a normal sentence. It has proper punctuation."}
{"text": "Thisisaverylongsentencewithoutanyspacesorpunctuationwhichwillexceedthethresholdbecauseithasmanymanywordsthatcannotbecountedproperlywithoutspacesandthiswillcauseittobefiltered"}
{"text": "Short text. Another sentence. Good punctuation throughout the entire document which is very helpful."}
```

### 📤 示例输出

```json
{"text": "This is a normal sentence. It has proper punctuation.", "no_punc_filter_label": 1}
{"text": "Thisisaverylongsentencewithoutanyspacesorpunctuationwhichwillexceedthethresholdbecauseithasmanymanywordsthatcannotbecountedproperlywithoutspacesandthiswillcauseittobefiltered", "no_punc_filter_label": 1}
{"text": "Short text. Another sentence. Good punctuation throughout the entire document which is very helpful.", "no_punc_filter_label": 1}
```

### 📊 结果分析

**样本1（正常句子）**：
- 按标点分割：["This is a normal sentence", " It has proper punctuation", ""]
- 最大单词数：约 5-6 个单词
- 阈值：112
- **通过过滤**（5-6 ≤ 112）

**样本2（无空格长句）**：
- 按标点分割：整段作为一个句子
- 使用 `split()` 分词：1 个"单词"（没有空格）
- 最大单词数：1
- 阈值：112
- **通过过滤**（1 ≤ 112）

**样本3（多个短句）**：
- 按标点分割多个句子
- 每个句子的最大单词数 < 112
- **通过过滤**（所有句子都在阈值内）

**应用场景**：
- 过滤包含超长句子的文本
- 确保文本具有良好的可读性
- 数据质量控制
- 过滤机器生成的异常文本

**注意事项**：
- 使用正则 `[–.!?,;•/|…]` 分割句子
- 使用空格 `split()` 计算单词数
- 算子名称虽为 NoPuncFilter，但实际是检测超长句子
- 阈值默认为 112 个单词
- 无空格的文本会被视为单个单词
