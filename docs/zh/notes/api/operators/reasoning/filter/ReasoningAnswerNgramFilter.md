---
title: ReasoningAnswerNgramFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/reasoning/filter/reasoninganswerngramfilter/
---

## 📘 概述

[ReasoningAnswerNgramFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/filter/reasoning_answer_ngram_filter.py) 是一个基于 n-gram 重复率的过滤算子，用于检测并过滤掉包含过多重复模式的答案。该算子通过计算问题与答案文本中 n-gram 的重复分数，并根据设定的阈值范围保留合格的数据行。

## `__init__`函数

```python
@OPERATOR_REGISTRY.register()
class ReasoningAnswerNgramFilter(OperatorABC):
    def __init__(self,
                min_score: float = 0.1,
                max_score: float = 1.0,
                ngrams: int = 5):
```

### init参数说明

| 参数名          | 类型  | 默认值 | 说明                           |
| :-------------- | :---- | :----- | :----------------------------- |
| **min_score**   | float | 0.1    | 最小可接受的 n-gram 重复分数。 |
| **max_score**   | float | 1.0    | 最大可接受的 n-gram 重复分数。 |
| **ngrams**      | int   | 5      | 用于计算重复率的 n-gram 大小。 |

## run函数

```python
def run(self, storage: DataFlowStorage, input_question_key: str = "instruction", input_answer_key: str = "generated_cot")
```

执行算子主逻辑，从存储中读取输入 DataFrame，计算 n-gram 重复分数并进行过滤，然后将过滤后的结果写回存储。

#### 参数

| 名称                   | 类型            | 默认值          | 说明                       |
| :--------------------- | :-------------- | :-------------- | :------------------------- |
| **storage**            | DataFlowStorage | 必需            | 数据流存储实例，负责读取与写入数据。 |
| **input_question_key** | str             | "instruction"   | 输入列名，对应问题字段。   |
| **input_answer_key**   | str             | "generated_cot" | 输入列名，对应答案字段。   |

## 🧠 示例用法

```python
from dataflow.operators.reasoning import ReasoningAnswerNgramFilter
from dataflow.utils.storage import FileStorage
from dataflow.core import LLMServingABC

class ReasoningAnswerNgramFilterTest():
    def __init__(self, llm_serving: LLMServingABC = None):
        
        self.storage = FileStorage(
            first_entry_file_name="example.json",
            cache_path="./cache_local",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.operator = ReasoningAnswerNgramFilter(
            min_score=0.1,
            max_score=1.0,
            ngrams=5
        )   
        
    def forward(self):
        self.operator.run(
            storage = self.storage.step(),
            input_question_key="instruction",
            input_answer_key="generated_cot"
        )

if __name__ == "__main__":
    pl = ReasoningAnswerNgramFilterTest()
    pl.forward()
```

#### 🧾 默认输出格式（Output Format）

该算子不改变数据的结构，而是过滤行。输出的 DataFrame 将包含与输入相同的列，但只保留 `input_question_key` 和 `input_answer_key` 组合文本的 n-gram 重复分数在 `[min_score, max_score]` 范围内的数据行。

| 字段          | 类型 | 说明       |
| :------------ | :--- | :--------- |
| instruction   | str  | 输入的问题文本。 |
| generated_cot | str  | 模型生成的推理式答案。 |

**示例输入：**

假设有两个样本，一个重复度高，一个重复度低。

```json
// Sample 1 (High Repetition)
{
"instruction": "What is love?",
"generated_cot": "Love is love is love is love is love is love is love is love."
}
// Sample 2 (Low Repetition)
{
"instruction": "A triangle has sides of lengths 7, 24, and 25. Determine if it is a right triangle.",
"generated_cot":"Solution:\n1. Identify key components and premises of the task\n→ Sides of the triangle are 7, 24, and 25.\n\n2. Apply relevant principles, theorems, or methods with step-by-step derivation or argument\n→ Use the Pythagorean theorem for a right triangle: a^2 + b^2 = c^2.\n→ Assume 25 is the hypotenuse (largest side), then check: 7^2 + 24^2 = 25^2.\n\n3. Perform any necessary calculations or logical checks with intermediate verification\n→ Calculate 7^2: 7^2 = 49.\n→ Calculate 24^2: 24^2 = 576.\n→ Calculate 25^2: 25^2 = 625.\n→ Verify: 49 + 576 = 625.\n\n4. Present the final answer or conclusion in a clear, unambiguous notation\n→ Since 7^2 + 24^2 = 25^2 holds true, the triangle is a right triangle.\n→ The triangle is a right triangle: \\boxed{\text{Yes}}."
}
```

**示例输出：**

使用默认参数 (`min_score=0.1`, `max_score=1.0`, `ngrams=5`)，第一个样本由于重复度过高，其分数会低于 0.1，因此被过滤掉。第二个样本重复度低，分数在范围内，被保留。

```json
{
"instruction":"A triangle has sides of lengths 7, 24, and 25. Determine if it is a right triangle.",
"generated_cot":"Solution:\n1. Identify key components and premises of the task\n→ Sides of the triangle are 7, 24, and 25.\n\n2. Apply relevant principles, theorems, or methods with step-by-step derivation or argument\n→ Use the Pythagorean theorem for a right triangle: a^2 + b^2 = c^2.\n→ Assume 25 is the hypotenuse (largest side), then check: 7^2 + 24^2 = 25^2.\n\n3. Perform any necessary calculations or logical checks with intermediate verification\n→ Calculate 7^2: 7^2 = 49.\n→ Calculate 24^2: 24^2 = 576.\n→ Calculate 25^2: 25^2 = 625.\n→ Verify: 49 + 576 = 625.\n\n4. Present the final answer or conclusion in a clear, unambiguous notation\n→ Since 7^2 + 24^2 = 25^2 holds true, the triangle is a right triangle.\n→ The triangle is a right triangle: \\boxed{\text{Yes}}."
}
```
