---
title: PIIAnonymizeRefiner
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/refine/piianonymizerefiner/
---

## 📘 概述

`PIIAnonymizeRefiner` 是一个使用 Presidio 和 BERT-NER 模型来识别并匿名化文本中个人身份信息（PII）的算子。它支持多种 PII 类型的检测和匿名化处理，有效保护数据隐私。

## `__init__`函数

```python
def __init__(self, lang='en', device='cuda', model_cache_dir='./dataflow_cache', model_name='dslim/bert-base-NER')
```

### init参数说明

| 参数名              | 类型 | 默认值                 | 说明                         |
| :------------------ | :--- | :----------------------- | :--------------------------- |
| **lang**            | str  | 'en'                     | 文本的语言代码，用于选择合适的模型。 |
| **device**          | str  | 'cuda'                   | 模型运行的设备，例如 'cuda' 或 'cpu'。 |
| **model_cache_dir** | str  | './dataflow_cache'       | 用于存储下载的NER模型的本地缓存目录。 |
| **model_name**      | str  | 'dslim/bert-base-NER'    | 使用的预训练NER模型名称。        |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :-------------- | :------- | :------- | :------- |
|                 |          |          |          |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

#### 参数

| 名称        | 类型            | 默认值 | 说明                                       |
| :---------- | :-------------- | :----- | :----------------------------------------- |
| **storage** | DataFlowStorage | 必需   | 数据流存储实例，负责读取与写入数据。       |
| **input_key** | str             | 必需   | 输入列名，对应需要进行PII匿名化处理的文本字段。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import PIIAnonymizeRefiner
from dataflow.utils.storage import FileStorage

class PIIAnonymizeRefinerTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/pii_anonymize_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.refiner = PIIAnonymizeRefiner()
        
    def forward(self):
        self.refiner.run(
            storage=self.storage.step(),
            input_key='text'
        )

if __name__ == "__main__":
    test = PIIAnonymizeRefinerTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :---- | :---------- |
| text | str | PII 信息被匿名化标签替换后的文本 |

### 📋 示例输入

```json
{"text":"My email is john@example.com"}
{"text":"Call me at 555-1234"}
{"text":"My name is John Smith"}
```

### 📤 示例输出

```json
{"text":"My email is <EMAIL_ADDRESS>"}
{"text":"Call me at 555-1234"}
{"text":"My name is <PERSON>"}
```

### 📊 结果分析

**样本1**："john@example.com" → `<EMAIL_ADDRESS>`
**样本2**：电话号码未被识别（可能格式不标准）
**样本3**："John Smith" → `<PERSON>`

**应用场景**：
- 数据隐私保护
- GDPR 合规处理
- 敏感信息脱敏
- 数据共享前的预处理

**注意事项**：
- 使用 Presidio 和 BERT-NER 模型进行 PII 识别
- 支持识别人名、邮箱、电话、地址等多种 PII 类型
- 首次使用会下载 BERT 模型
- 识别准确率依赖于模型和文本格式
