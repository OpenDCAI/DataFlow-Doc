---
title: IDCardFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/idcardfilter/
---

## 📘 概述
`IDCardFilter` 算子用于检测并过滤包含身份证相关术语的文本。它通过正则表达式匹配常见的身份证号码及其相关关键词，以识别并移除可能包含敏感个人信息的数据行，从而起到数据清洗与隐私保护的作用。

## `__init__`函数
```python
def __init__(self, threshold:int=3)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :---------- | :--- | :---- | :--------------------------------- |
| **threshold** | int | 3 | 匹配身份证相关术语的次数阈值。当文本中相关术语的出现次数达到或超过此阈值时，该文本将被过滤。 |

## `run`函数
```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='id_card_filter_label')
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :---------- | :---------------- | :----------------------- | :---------------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待检查的文本字段。 |
| **output_key** | str | 'id_card_filter_label' | 输出列名，用于存储过滤结果的标签（1表示通过，0表示过滤）。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import IDCardFilter
from dataflow.utils.storage import FileStorage

class IDCardFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/idcard_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = IDCardFilter(threshold=3)
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='id_card_filter_label'
        )

if __name__ == "__main__":
    test = IDCardFilterTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :----------------------- | :---- | :----------------------------------------------------------- |
| text | str | 原始输入文本 |
| id_card_filter_label | int | 过滤标签。值为1表示通过检测（身份证相关术语数量<阈值），0表示未通过 |

### 📋 示例输入

```json
{"text": "This is a normal conversation about daily life."}
{"text": "Please provide your 身份证号码 and 身份证 information for verification. Contact ID card number."}
```

### 📤 示例输出

```json
{"text": "This is a normal conversation about daily life.", "id_card_filter_label": 1}
```

### 📊 结果分析

**样本1（正常对话）**：
- 文本："This is a normal conversation about daily life."
- 不包含身份证相关术语
- 匹配次数：0
- **通过过滤**（< 3阈值）

**样本2（包含敏感信息）**：
- 文本："Please provide your 身份证号码 and 身份证 information for verification. Contact ID card number."
- 包含多个身份证相关术语：
  - "身份证号码"（1次）
  - "身份证"（1次）
  - "ID card"（1次）
- 匹配次数：≥3
- **未通过过滤**（≥ 3阈值）

**检测的关键词模式**（包括但不限于）：
- 中文：身份证、身份证号、身份证号码、证件号、证件号码
- 英文：ID card、identity card、ID number
- 正则模式：可能包括身份证号码格式的匹配

**应用场景**：
- 隐私保护，过滤包含身份证信息的文本
- 数据合规性检查
- 敏感信息检测
- 防止个人信息泄露

**注意事项**：
- 阈值默认为3，表示身份证相关术语出现3次及以上时过滤
- 同时检测中英文关键词
- 使用正则表达式进行模式匹配
- 建议根据具体应用场景调整阈值
- 该算子侧重于关键词匹配，不进行身份证号码格式验证
