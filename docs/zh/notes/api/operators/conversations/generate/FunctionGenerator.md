---
title: FunctionGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/conversations/generate/functiongenerator/
---

## 📘 概述

[FunctionGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) 是一个函数生成算子，基于组合任务及其相关子任务，使用LLM服务生成对应的函数列表。

## \_\_init\_\_函数

```python
def __init__(self, llm_serving: LLMServingABC)
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行推理与生成。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## run函数

```python
def run(self, storage: DataFlowStorage, input_composition_task_key: str, input_sub_tasks_keys: list[str], output_key: str = "functions")
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input\_composition\_task\_key** | str | 必需 | 输入列名，对应组合任务字段。 |
| **input\_sub\_tasks\_keys** | list[str] | 必需 | 输入列名列表，对应子任务字段。 |
| **output\_key** | str | "functions" | 输出列名，对应生成的函数列表字段。 |

## 🧠 示例用法

```python
from dataflow.operators.conversations import FunctionGenerator
from dataflow.utils.storage import FileStorage
from dataflow.serving import APILLMServing_request
from dataflow.core import LLMServingABC

class FunctionGeneratorTest:
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

        self.generator = FunctionGenerator(
            llm_serving=self.llm_serving
        )

    def forward(self):
        self.generator.run(
            storage=self.storage.step(),
            input_composition_task_key="composition_task",
            input_sub_tasks_keys=["atom_task", "parallel_task", "subsequent_task"],
            output_key="functions"
        )

if __name__ == "__main__":
    pl = FunctionGeneratorTest()
    pl.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| (input\_composition\_task\_key) | str | 输入的组合任务文本。 |
| (input\_sub\_tasks\_keys) | list[str] | 输入的子任务文本列表。 |
| functions | str | 模型生成的函数列表。 |

示例输入：

```json
{
  "composition_task": "Find the airline offering the cheapest fare within a budget of $500 for a round-trip flight from New York to London, departing on November 15th and returning on November 22nd.",
  "atom_task": "Search for a round-trip flight from New York to London, departing on November 15th and returning on November 22nd, with a budget of $500 or less.",
  "subsequent_task": "What is the airline offering the cheapest fare within the budget for this round-trip flight?"
}
```

示例输出：

```json
{
  "composition_task": "Find the airline offering the cheapest fare within a budget of $500 for a round-trip flight from New York to London, departing on November 15th and returning on November 22nd.",
  "atom_task": "Search for a round-trip flight from New York to London, departing on November 15th and returning on November 22nd, with a budget of $500 or less.",
  "subsequent_task": "What is the airline offering the cheapest fare within the budget for this round-trip flight?",
  "functions": "```json\n[\n    {\n        \"sub_task\": \"Search for a round-trip flight from New York to London, departing on November 15th and returning on November 22nd, with a budget of $500 or less.\",\n        \"func_list\": [\n            {\n                \"name\": \"searchFlights\",\n                \"description\": \"Retrieves available flight options for a given route and dates.\",\n                \"parameters\": {\n                    \"departure_city\": {\n                        \"type\": \"string\",\n                        \"description\": \"The city from which the flight will depart.\"\n                    },\n                    \"arrival_city\": {\n                        \"type\": \"string\",\n                        \"description\": \"The city to which the flight will arrive.\"\n                    },\n                    \"departure_date\": {\n                        \"type\": \"string\",\n                        \"description\": \"The date of the departure flight, in YYYY-MM-DD format.\"\n                    },\n                    \"return_date\": {\n                        \"type\": \"string\",\n                        \"description\": \"The date of the return flight, in YYYY-MM-DD format.\"\n                    },\n                    \"max_budget\": {\n                        \"type\": \"number\",\n                        \"description\": \"The maximum budget for the flight, in USD.\"\n                    }\n                },\n                \"required\": [\"departure_city\", \"arrival_city\", \"departure_date\", \"return_date\", \"max_budget\"],\n                \"responses\": {\n                    \"flights\": {\n                        \"type\": \"array\",\n                        \"description\": \"A list of flights within the specified budget, each containing flight details.\"\n                    }\n                }\n            }\n        ]\n    },\n    {\n        \"sub_task\": \"What is the airline offering the cheapest fare within the budget for this round-trip flight?\",\n        \"func_list\": []\n    }\n]\n```"
}
```
