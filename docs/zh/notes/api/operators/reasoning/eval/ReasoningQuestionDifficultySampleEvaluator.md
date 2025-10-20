---
title: ReasoningQuestionDifficultySampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/reasoning/eval/reasoningquestiondifficultysampleevaluator/
---

## 📘 概述

[ReasoningQuestionDifficultySampleEvaluator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/evaluate/reasoning_question_difficulty_sample_evaluator.py)
是一个问题难度评估算子。它通过调用大语言模型（LLM）来分析问题的复杂度，并为每个问题生成一个从1到10的难度评分。

## `__init__`函数

```python
@prompt_restrict(
    MathQuestionDifficultyPrompt
)

@OPERATOR_REGISTRY.register()
class ReasoningQuestionDifficultySampleEvaluator(OperatorABC):
    def __init__(self, llm_serving: LLMServingABC = None):
```

### init参数说明

| 参数名          | 类型          | 默认值 | 说明                           |
| :-------------- | :------------ | :----- | :----------------------------- |
| **llm_serving** | LLMServingABC | 必需   | 大语言模型服务实例，用于执行推理与生成。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| --------------- | -------- | -------- | -------- |
| MathQuestionDifficultyPrompt | 问题难度评估 | 对用户问题进行难度评估 | 输入问题，输出1到10的难度评分 |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str, output_key:str="difficulty_score")
```

#### 参数

| 名称         | 类型            | 默认值               | 说明                           |
| :----------- | :-------------- | :------------------- | :----------------------------- |
| **storage**  | DataFlowStorage | 必需                 | 数据流存储实例，负责读取与写入数据。   |
| **input_key**| str             | 必需                 | 输入列名，对应问题字段。         |
| **output_key**| str             | "difficulty_score" | 输出列名，对应生成的难度分数字段。 |

## 🧠 示例用法

```python
from dataflow.operators.reasoning import ReasoningQuestionDifficultySampleEvaluator
from dataflow.utils.storage import FileStorage
from dataflow.core import LLMServingABC
from dataflow.serving import APILLMServing_request

class ReasoningQuestionDifficultySampleEvaluatorTest():
    def __init__(self, llm_serving: LLMServingABC = None):
        
        self.storage = FileStorage(
            first_entry_file_name="example.json",
            cache_path="./cache_local",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        # use API server as LLM serving
        self.llm_serving = APILLMServing_request(
                    api_url="",
                    model_name="gpt-4o",
                    max_workers=30
        )
        
        self.evaluator = ReasoningQuestionDifficultySampleEvaluator(llm_serving=self.llm_serving)
        
    def forward(self):
        self.evaluator.run(
            storage = self.storage.step(),
            input_key = "instruction",
            output_key = "difficulty_score",
        )

if __name__ == "__main__":
    pl = ReasoningQuestionDifficultySampleEvaluatorTest()
    pl.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| **difficulty_score** | int | 问题的难度评分，从1到10。 |

示例输入：

```json
{
    "instruction": "计算2的5次方。"
}
```

示例输出：

```json
{
    "difficulty_score": 3
}
```
