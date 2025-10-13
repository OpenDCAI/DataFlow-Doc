---
title: ReasoningAnswerGroundTruthFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/reasoning/filter/reasoninganswergroundtruthfilter/
---

## 📘 概述

[ReasoningAnswerGroundTruthFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/filter/reasoning_answer_ground_truth_filter.py) 是一个答案真值过滤算子，用于对比模型生成的预测答案与标准答案（ground truth），并筛选出答案匹配的数据行。该算子支持精确字符串匹配和数学等价性验证两种比较方式，适用于对生成结果进行自动评估和过滤的场景。

## __init__函数

```python
def __init__(self, compare_method: Literal["math_verify", "exact"] = "math_verify")
```

### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :--------------------------------- | :-------------- | :----------------------------------------------------------------------------------------------------- |
| **compare_method**  | `Literal["math_verify", "exact"]` | `"math_verify"` | 用于对比预测答案与标准答案的比较方法。`"exact"`表示精确字符串匹配，`"math_verify"`表示数学等价性验证。 |

### Prompt模板说明

## run函数

```python
def run(self, storage: DataFlowStorage, input_test_answer_key: str = "generated_cot", input_gt_answer_key: str = "golden_answer")
```

#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------------------ | :---------------- | :---------------- | :----------------------------------------- |
| **storage** | `DataFlowStorage` | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_test_answer_key** | `str` | `"generated_cot"` | 输入列名，对应待验证的预测答案字段。 |
| **input_gt_answer_key** | `str` | `"golden_answer"` | 输入列名，对应标准答案（ground truth）字段。 |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）
该算子会过滤输入数据，只保留预测答案与标准答案匹配的数据行。输出的数据格式与输入数据格式完全相同，但只包含通过验证的子集。
