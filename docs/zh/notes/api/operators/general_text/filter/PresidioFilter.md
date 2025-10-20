---
title: PresidioFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/presidiofilter/
---

## 📘 概述

`PresidioFilter` 是一个基于 PII (Personally Identifiable Information) 分数的数据过滤算子。它利用 Microsoft Presidio 模型识别并计算文本中的私人实体（如姓名、邮箱、电话号码等）数量，并根据设定的分数阈值范围对数据进行筛选。该算子主要用于数据隐私保护和合规性检查场景。

## __init__函数

```python
def __init__(self, min_score: int = 0, max_score: int = 5, lang='en', device='cuda', model_cache_dir='./dataflow_cache'):
```

### init参数说明

| 参数名              | 类型 | 默认值               | 说明                           |
| :------------------ | :--- | :--------------------- | :----------------------------- |
| **min_score**       | int  | 0                      | 保留样本的最小 PII 数量阈值。     |
| **max_score**       | int  | 5                      | 保留样本的最大 PII 数量阈值。     |
| **lang**            | str  | 'en'                   | 文本语言。                       |
| **device**          | str  | 'cuda'                 | 模型运行设备。                   |
| **model_cache_dir** | str  | './dataflow_cache' | 模型缓存目录。                   |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'PresidioScore'):
```

#### 参数

| 名称          | 类型              | 默认值          | 说明                                 |
| :------------ | :---------------- | :---------------- | :----------------------------------- |
| **storage**   | DataFlowStorage   | 必需              | 数据流存储实例，负责读取与写入数据。   |
| **input_key** | str               | 必需              | 输入列名，对应需要检测 PII 的文本字段。 |
| **output_key**| str               | 'PresidioScore' | 输出列名，对应 PII 分数字段。        |

## 🧠 示例用法

```python
from dataflow.operators.general_text import PresidioFilter
from dataflow.utils.storage import FileStorage

class PresidioFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/presidio_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = PresidioFilter(
            min_score=0,
            max_score=5,
            lang='en',
            device='cuda',
            model_cache_dir='./dataflow_cache'
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='PresidioScore'
        )

if __name__ == "__main__":
    test = PresidioFilterTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段          | 类型 | 说明                           |
| :------------ | :--- | :----------------------------- |
| PresidioScore | int  | 模型生成的文本中 PII 实体的数量。 |

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

### 📊 结果分析

**样本1（普通文本）**：
- 检测到的 PII 数量：0
- 分数范围：[0, 5]
- **通过过滤**（0 在范围内）
- 特点：无个人身份信息

**样本2（包含姓名和地点）**：
- 检测到的 PII 数量：2
  - PERSON: "John Smith"
  - LOCATION: "New York"
- 分数范围：[0, 5]
- **通过过滤**（2 在范围内）

**样本3（敏感信息文本）**：
- 检测到的 PII 数量：4
  - EMAIL_ADDRESS: "john.doe@example.com"
  - PHONE_NUMBER: "+1-555-123-4567"
  - CREDIT_CARD: "4532-1234-5678-9010"
  - 可能的其他实体
- 分数范围：[0, 5]
- **通过过滤**（4 在范围内）

**支持的PII类型**：
- 姓名 (PERSON)
- 地点 (LOCATION)
- 邮箱地址 (EMAIL_ADDRESS)
- 电话号码 (PHONE_NUMBER)
- 信用卡号 (CREDIT_CARD)
- 身份证号等

**应用场景**：
- 数据隐私保护
- 合规性检查（GDPR、CCPA）
- 敏感信息检测
- 数据脱敏前的评估

**注意事项**：
- 使用 `dslim/bert-base-NER` 模型
- 支持多种语言，通过 `lang` 参数设置
- `min_score` 和 `max_score` 定义保留样本的PII数量范围
- 可以设置较小的 `max_score` 来过滤高风险文本
