---
title: EvaluateSmilesEquivalence
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/chemistry/eval/evaluatesmilesequivalence/
---

## 📘 概述
`EvaluateSmilesEquivalence` 是一个SMILES（Simplified Molecular-Input Line-Entry System）等价性评估算子。它逐行比较`golden_label`（标准答案）和`synth_smiles`（模型生成）中的分子结构字符串，利用RDKit进行规范化比对，并计算准确率。该算子最终会向DataFrame中添加包含详细比对结果、行级别分数和整体评估摘要的新列。

## __init__函数
```python
def __init__(self, llm_serving: LLMServingABC = None):
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **llm_serving** | LLMServingABC | None | 大语言模型服务实例（当前算子未实际使用）。 |

### Prompt模板说明

## run函数
```python
def run(
    self,
    storage: DataFlowStorage,
    golden_key: str = "golden_label",
    synth_key: str = "synth_smiles",
    output_key: str = "final_result",
):
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **golden_key** | str | "golden_label" | 输入列名，该列包含标准答案的SMILES数据。 |
| **synth_key** | str | "synth_smiles" | 输入列名，该列包含待评估的SMILES数据。 |
| **output_key** | str | "final_result" | 输出列名，用于存储逐项的详细评估结果。 |

## 🧠 示例用法
