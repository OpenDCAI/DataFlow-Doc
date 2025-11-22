---
title: PerspectiveSampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/eval/perspectivesampleevaluator/
---

## 📘 概述

`PerspectiveSampleEvaluator` 是一个评估算子，它使用 Google Perspective API 为输入的文本分配毒性分数。该算子可以检测文本中的有害内容、侮辱性语言等，分数范围为 0-1，分数越高表明文本的毒性越高。

**主要功能**：
- 检测文本中的毒性内容（Toxicity）
- 支持批量并发处理
- 自动处理超长文本（最大 20480 字节）

**使用前提**：需要配置 Google API Key

## `__init__`函数

```python
def __init__(self, serving: PerspectiveAPIServing = None):
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :-- | :-- | :-- | :-- |
| **serving** | PerspectiveAPIServing | 必需 | Perspective API 服务实例，用于执行评估。需要传入配置好的 PerspectiveAPIServing 对象。 |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'PerspectiveScore'):
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :-- | :-- | :-- | :-- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待评估的文本字段。 |
| **output_key** | str | "PerspectiveScore" | 输出列名，对应生成的毒性分数字段。 |

## 🧠 示例用法

### 配置 API Key

使用前需要先设置环境变量：
```bash
export GOOGLE_API_KEY="your-google-api-key"
```

或在 Python 中设置：
```python
import os
os.environ["GOOGLE_API_KEY"] = "your-google-api-key"
```

### 测试代码

```python
from dataflow.operators.general_text import PerspectiveSampleEvaluator
from dataflow.utils.storage import FileStorage
from dataflow.serving import PerspectiveAPIServing

class PerspectiveSampleEvaluatorTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/perspective_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.serving = PerspectiveAPIServing(max_workers=10)
        self.evaluator = PerspectiveSampleEvaluator(serving=self.serving)
        
    def forward(self):
        self.evaluator.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='PerspectiveScore'
        )

if __name__ == "__main__":
    test = PerspectiveSampleEvaluatorTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :-- | :-- | :-- |
| {input_key} | str | 输入数据中的原始文本字段 |
| PerspectiveScore | float | 毒性分数（0到1之间），越高表示毒性越大 |

### 📋 示例输入

```json
{"text": "Thank you for your help! I really appreciate your kindness and support."}
{"text": "I disagree with your opinion, but I respect your perspective on this matter."}
{"text": "You are an idiot and your ideas are completely stupid and worthless."}
```

### 📤 示例输出

```json
{"text": "Thank you for your help! I really appreciate your kindness and support.", "PerspectiveScore": 0.012}
{"text": "I disagree with your opinion, but I respect your perspective on this matter.", "PerspectiveScore": 0.089}
{"text": "You are an idiot and your ideas are completely stupid and worthless.", "PerspectiveScore": 0.952}
```

**结果分析**:
- **友好文本**：PerspectiveScore=0.012（几乎无毒性），感谢和积极的表达
- **中立文本**：PerspectiveScore=0.089（低毒性），虽然表达不同意见但保持尊重
- **攻击性文本**：PerspectiveScore=0.952（高毒性），包含侮辱性词汇和攻击性语言

**分数解读**：
- 0.0 - 0.3：低毒性或无毒性
- 0.3 - 0.7：中等毒性
- 0.7 - 1.0：高毒性
