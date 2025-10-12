---
title: PerspectiveFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/perspectivefilter/
---

## 📘 概述

`PerspectiveFilter` 是一个基于 Perspective API 的数据过滤算子，用于评估文本的毒性，并根据设定的得分阈值筛选数据。得分越高，表示文本的毒性越高。

## __init__函数

```python
def __init__(self, min_score: float = 0.0, max_score: float = 0.5):
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :-------------- | :---- | :------ | :------------------------------------------------------- |
| **min_score** | float | 0.0 | 最小毒性得分阈值。保留得分大于或等于此值的文本。 |
| **max_score** | float | 0.5 | 最大毒性得分阈值。保留得分小于或等于此值的文本。 |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key: str = 'PerspectiveScore'):
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :------------------- | :------------------------------------ |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待评估毒性的文本字段。 |
| **output_key** | str | "PerspectiveScore" | 输出列名，对应生成的毒性得分字段。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import PerspectiveFilter
from dataflow.utils.storage import FileStorage

class PerspectiveFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/perspective_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = PerspectiveFilter(
            min_score=0.0,
            max_score=0.5
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_key='PerspectiveScore'
        )

if __name__ == "__main__":
    test = PerspectiveFilterTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :----------------- | :---- | :--------------------- |
| [input_key] | str | 输入的待评估文本。 |
| [output_key] | float | 模型生成的毒性分数值。 |

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
```

### 📊 结果分析

**样本1（友好文本）**：
- Perspective 毒性分数：0.012
- 分数范围：[0.0, 0.5]
- **通过过滤**（0.012 在范围内）
- 特点：感谢和积极的表达，几乎无毒性

**样本2（中立文本）**：
- Perspective 毒性分数：0.089
- 分数范围：[0.0, 0.5]
- **通过过滤**（0.089 在范围内）
- 特点：虽然表达不同意见但保持尊重，低毒性

**样本3（攻击性文本）**：
- Perspective 毒性分数：0.952
- 分数范围：[0.0, 0.5]
- **未通过过滤**（0.952 > 0.5）
- 特点：包含侮辱性词汇和攻击性语言，高毒性

**分数解读**：
- **0.0 - 0.3**：低毒性或无毒性（礼貌、友好）
- **0.3 - 0.7**：中等毒性（可能有争议性内容）
- **0.7 - 1.0**：高毒性（侮辱、攻击、仇恨言论）

**应用场景**：
- 内容审核系统
- 社交媒体评论过滤
- 用户生成内容质量控制
- 构建健康的在线社区

**注意事项**：
- 需要配置 Google Perspective API Key
- API 调用有速率限制
- 支持多种语言，但英文效果最佳
- NaN 值的样本会被自动保留
