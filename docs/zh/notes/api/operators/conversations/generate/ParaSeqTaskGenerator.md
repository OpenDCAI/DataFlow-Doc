---
title: ParaSeqTaskGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/conversations/generate/paraseqtaskgenerator/
---

## 📘 概述

`ParaSeqTaskGenerator` 是一个任务生成算子，它基于输入的原子任务，利用大语言模型（LLM）服务生成三种相关的任务类型：并行任务、后继任务以及将这两者结合的组合任务。

## `__init__`函数

```python
def __init__(self, llm_serving: LLMServingABC)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行推理与生成。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| --- | --- | --- | --- |
| | | | |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_task_key: str, output_parallel_task_key: str = "parallel_task",  output_subsequent_task_key: str = "subsequent_task", output_composition_task_key: str = "composition_task")
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_task_key** | str | 必需 | 输入列名，对应原子任务字段。 |
| **output_parallel_task_key** | str | "parallel_task" | 输出列名，对应生成的并行任务字段。 |
| **output_subsequent_task_key** | str | "subsequent_task" | 输出列名，对应生成的后继任务字段。 |
| **output_composition_task_key** | str | "composition_task" | 输出列名，对应生成的组合任务字段。 |

## 🧠 示例用法

```python
from dataflow.operators.conversations import ParaSeqTaskGenerator
from dataflow.utils.storage import FileStorage
from dataflow.serving import APILLMServing_request
from dataflow.core import LLMServingABC

class ParaSeqTaskGeneratorTest:
    def __init__(self, llm_serving: LLMServingABC = None):
        self.storage = FileStorage(
            first_entry_file_name="input.jsonl",
            cache_path="./cache_local",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )

        self.llm_serving = APILLMServing_request(
            api_url="",
            model_name="gpt-4o",
            max_workers=30
        )

        self.generator = ParaSeqTaskGenerator(
            llm_serving=self.llm_serving
        )

    def forward(self):
        self.generator.run(
            storage=self.storage.step(),
            input_task_key="atom_task",
            output_parallel_task_key="parallel_task",
            output_subsequent_task_key="subsequent_task",
            output_composition_task_key="composition_task"
        )

if __name__ == "__main__":
    pl = ParaSeqTaskGeneratorTest()
    pl.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| {input_task_key} | str | 输入的原子任务文本。 |
| parallel_task | str | 模型生成的并行任务。 |
| subsequent_task | str | 模型生成的后继任务。 |
| composition_task | str | 模型生成的组合任务。 |

示例输入：

```json
{
  "atom_task": "Search for a round-trip flight from New York to London, departing on November 15th and returning on November 22nd, with a budget of $500 or less."
}
```

示例输出：

```json
{
  "atom_task": "Search for a round-trip flight from New York to London, departing on November 15th and returning on November 22nd, with a budget of $500 or less.",
  "parallel_task": "Find accommodation options in London from November 15th to November 22nd within a budget of $100 per night.",
  "subsequent_task": "Calculate the total cost of flights and accommodation for the trip and check if it is within the overall trip budget.",
  "composition_task": "Determine if you can travel from New York to London and back with the flight and accommodation options while staying within the total budget for the trip."
}
```
