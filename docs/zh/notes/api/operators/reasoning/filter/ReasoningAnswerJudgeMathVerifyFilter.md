---
title: ReasoningAnswerJudgeMathVerifyFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/reasoning/filter/reasoninganswerjudgemathverifyfilter/
---

## 📘 概述
[ReasoningAnswerJudgeMathVerifyFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/judge/math_verify_filter.py) 是一个数学答案验证算子，通过符号计算来验证答案的正确性。它能够解析数学表达式，并与标准答案进行等价性验证，同时支持设定数值容差。

## __init__函数

```python
def __init__(self, config: dict)
```

### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **config** | dict | 必需 | 配置字典，用于初始化算子。 |

### Prompt模板说明

## run函数
```python
def run(
    self,
    storage:DataFlowStorage,
    input_key: str = "instruction",
    answer_key: str = "student_answer",
    gt_key: str = "correct_answer",
    result_key: str = "result",
)
```
执行算子主逻辑，从存储中读取包含待验证答案和标准答案的 DataFrame，对答案进行数学验证，并将验证结果（True/False）写回存储。

#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :---------------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | "instruction" | 输入列名，对应问题字段。 |
| **answer_key** | str | "student_answer" | 输入列名，对应待验证的答案字段。 |
| **gt_key** | str | "correct_answer" | 输入列名，对应标准答案字段。 |
| **result_key** | str | "result" | 输出列名，用于存储验证结果（True/False）。 |

## 🧠 示例用法

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :-------------- | :---- | :----------------------------- |
| instruction | str | 输入的问题文本。 |
| student_answer | str | 待验证的学生答案。 |
| correct_answer | str | 标准答案。 |
| result | bool | 验证结果，`True` 表示正确，`False` 表示错误。 |

示例输入：
```json
{
"instruction": "求解方程 x^2 - 4 = 0",
"student_answer": "x = 2",
"correct_answer": "x = \\pm 2"
}
```
示例输出：
```json
{
"instruction": "求解方程 x^2 - 4 = 0",
"student_answer": "x = 2",
"correct_answer": "x = \\pm 2",
"result": false
}
```
