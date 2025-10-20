---
title: PresidioSampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/eval/presidiosampleevaluator/
---

## 📘 概述

`PresidioSampleEvaluator` 是一个使用 Microsoft Presidio 框架识别文本中个人身份信息 (PII) 的评估算子。它会返回检测到的 PII 实体数量。该算子支持多种实体类型，如姓名、邮箱、电话号码、信用卡号等，基于 `dslim/bert-base-NER` 模型实现，适用于评估文本的隐私安全风险。

**主要功能**：
- 检测个人身份信息（姓名、地点等）
- 识别联系方式（邮箱、电话）
- 发现敏感信息（信用卡号等）
- 返回检测到的 PII 实体数量

## \_\_init\_\_函数

```python
def __init__(self, device='cuda', lang='en', model_cache_dir='./dataflow_cache')
```

### init参数说明

| 参数名              | 类型 | 默认值                 | 说明                         |
| :------------------ | :--- | :----------------------- | :--------------------------- |
| **device**          | str  | 'cuda'                   | 指定运行模型的设备（如 'cuda' 或 'cpu'）。 |
| **lang**            | str  | 'en'                     | 指定待分析文本的语言。         |
| **model\_cache\_dir** | str  | './dataflow\_cache' | 用于存储下载模型的缓存目录路径。 |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str='PresidioScore')
```

#### 参数

| 名称        | 类型            | 默认值          | 说明                                 |
| :---------- | :-------------- | :-------------- | :----------------------------------- |
| **storage** | DataFlowStorage | 必需            | 数据流存储实例，负责读取与写入数据。 |
| **input\_key**  | str             | 必需            | 输入列名，对应待检测的文本字段。     |
| **output\_key** | str             | 'PresidioScore' | 输出列名，对应检测到的PII实体数量。    |

## 🧠 示例用法
```python
from dataflow.operators.general_text import PresidioSampleEvaluator
from dataflow.utils.storage import FileStorage

class PresidioSampleEvaluatorTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/presidio_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.evaluator = PresidioSampleEvaluator(
            device='cuda',
            lang='en',
            model_cache_dir='./dataflow_cache'
        )
        
    def forward(self):
        self.evaluator.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='PresidioScore'
        )

if __name__ == "__main__":
    test = PresidioSampleEvaluatorTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段          | 类型 | 说明                         |
| :------------ | :--- | :--------------------------- |
| {input_key}  | str  | 输入的待检测文本 |
| PresidioScore | int  | 检测到的PII（个人身份信息）实体数量 |

### 📋 示例输入
```json
{"text": "The weather is nice today. Let's go for a walk in the park."}
{"text": "My name is John Smith and I live in New York."}
{"text": "Please contact me at john.doe@example.com or call me at +1-555-123-4567. My credit card number is 4532-1234-5678-9010."}
```

### 📤 示例输出
```json
{"text": "The weather is nice today. Let's go for a walk in the park.", "PresidioScore": 0}
{"text": "My name is John Smith and I live in New York.", "PresidioScore": 2}
{"text": "Please contact me at john.doe@example.com or call me at +1-555-123-4567. My credit card number is 4532-1234-5678-9010.", "PresidioScore": 4}
```

**结果分析**:
- **普通文本**：PresidioScore=0（无PII信息）
- **包含姓名和地点**：PresidioScore=2（检测到"John Smith"和"New York"）
- **敏感信息文本**：PresidioScore=4（检测到邮箱、电话号码、信用卡号等多个PII实体）
