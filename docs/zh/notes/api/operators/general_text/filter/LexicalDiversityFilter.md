---
title: LexicalDiversityFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/filter/lexicaldiversityfilter/
---

## 📘 概述

`LexicalDiversityFilter`是一个基于词汇多样性分数的过滤器。它使用 MTLD（移动平均类型-令牌比）和 HDD（超几何分布多样性）两种方法计算文本的词汇多样性，并根据设定的分数阈值过滤数据。分数越高，代表文本使用的词汇越丰富。

## __init__函数

```python
def __init__(self, min_scores: dict = {'mtld': 50, 'hdd': 0.8}, max_scores: dict = {'mtld': 99999, 'hdd': 1.0})
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **min_scores** | dict | `{'mtld': 50, 'hdd': 0.8}` | 各项指标的最小分数阈值字典。 |
| **max_scores** | dict | `{'mtld': 99999, 'hdd': 1.0}` | 各项指标的最大分数阈值字典。 |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_keys = ['mtld', 'hdd'])
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应需要分析词汇多样性的文本字段。 |
| **output_keys** | list | `['mtld', 'hdd']` | 用于过滤的指标名称列表，必须与 `min_scores` 和 `max_scores` 的键一致。 |

## 🧠 示例用法

```python
from dataflow.operators.general_text import LexicalDiversityFilter
from dataflow.utils.storage import FileStorage

class LexicalDiversityFilterTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/lexical_diversity_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.filter = LexicalDiversityFilter(
            min_scores={'mtld': 50, 'hdd': 0.8},
            max_scores={'mtld': 99999, 'hdd': 1.0}
        )
        
    def forward(self):
        self.filter.run(
            storage=self.storage.step(),
            input_key='text',
            output_keys=['mtld', 'hdd']
        )

if __name__ == "__main__":
    test = LexicalDiversityFilterTest()
    test.forward()
```

#### 🧾 默认输出格式（Output Format）

算子执行后，会在原始DataFrame中增加新的列，并根据过滤结果将符合条件的行写入新的存储文件中。新增列如下：

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| text | str | 原始输入的文本列。 |
| LexicalDiversityMTLDScore | float | MTLD词汇多样性分数（值越高表示多样性越好）。 |
| LexicalDiversityHD-DScore | float | HDD词汇多样性分数（值越高表示多样性越好）。 |
| LexicalDiversityMTLDScore_label | int | MTLD分数的过滤标签（1表示通过，0表示不在阈值范围）。 |
| LexicalDiversityHD-DScore_label | int | HDD分数的过滤标签（1表示通过，0表示不在阈值范围）。 |

### 📋 示例输入

```json
{"text": "The fascinating world of natural language processing encompasses various sophisticated algorithms and methodologies. Machine learning techniques enable computers to understand, interpret, and generate human language effectively. Advanced neural networks transform raw textual data into meaningful representations through complex mathematical operations. Researchers continuously develop innovative approaches to improve accuracy and efficiency in computational linguistics applications."}
{"text": "Good good good good good good good good good good good good good good good good good good good good good good good good good good."}
```

### 📤 示例输出

```json
{"text": "The fascinating world...", "LexicalDiversityMTLDScore": 145.23, "LexicalDiversityHD-DScore": 0.92, "LexicalDiversityMTLDScore_label": 1, "LexicalDiversityHD-DScore_label": 1}
```

### 📊 结果分析

**样本1（词汇丰富的文本）**：
- 文本长度：约55个单词
- MTLD分数：145.23（高多样性，≥ 50阈值）
- HDD分数：0.92（词汇丰富，≥ 0.8阈值）
- **通过过滤**（两个指标都在范围内）

**样本2（重复词汇的文本）**：
- 文本长度：约26个单词
- MTLD分数：可能为NaN（文本过短）
- HDD分数：约0.04（极低多样性，< 0.8阈值）
- **未通过过滤**（HDD低于最小阈值）

**关键特性**：
1. **MTLD（Measure of Textual Lexical Diversity）**：通过计算维持特定TTR阈值所需的单词数量来评估词汇多样性
2. **HDD（HD-D, Hypergeometric Distribution Diversity）**：基于超几何分布的词汇丰富度估计方法

**应用场景**：
- 筛选词汇丰富、表达多样的高质量文本
- 过滤重复性高、词汇贫乏的低质量内容
- 构建语言模型训练数据集
- 确保文本的词汇多样性符合特定标准

**注意事项**：
- **文本长度要求**：建议文本长度大于50个单词，过短的文本可能返回NaN值
- **NaN值处理**：算子会自动将NaN值视为通过（允许短文本通过）
- **阈值设置**：MTLD通常在0-200范围，HDD在0-1范围
- **默认阈值**：MTLD ≥ 50，HDD在0.8-1.0之间，适合高质量文本筛选
- 可根据具体应用场景调整阈值范围
