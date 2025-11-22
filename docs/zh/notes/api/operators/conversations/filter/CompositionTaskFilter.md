---
title: CompositionTaskFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/conversations/filter/compositiontaskfilter/
---

## 📘 概述
`CompositionTaskFilter` 是一个组合任务筛选算子。它利用大语言模型（LLM）服务，根据组合任务及其对应的子任务，判断该组合任务是否具备可行性与完备性，并筛选出可执行的任务。

## __init__函数
```python
def __init__(self, llm_serving: LLMServingABC)
```

### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行判断和推理。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
| | | | |

## run函数
```python
def run(self, storage: DataFlowStorage, input_composition_task_key: str, input_sub_tasks_keys: list[str], output_key: str = "runable_label")
```
执行算子主逻辑，从存储中读取包含组合任务与子任务的 DataFrame，调用 LLM 判断任务可行性，并将筛选后的结果写回存储。

#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_composition_task_key** | str | 必需 | 输入列名，对应组合任务字段。 |
| **input_sub_tasks_keys** | list[str] | 必需 | 输入列名列表，对应子任务字段。 |
| **output_key** | str | `"runable_label"` | 输出列名，对应可行性标签字段。 |

## 🧠 示例用法
```python
from dataflow.operators.conversations import CompositionTaskFilter
from dataflow.utils.storage import FileStorage
from dataflow.serving import APILLMServing_request
from dataflow.core import LLMServingABC

class CompositionTaskFilterTest:
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

        self.operator = CompositionTaskFilter(
            llm_serving=self.llm_serving
        )

    def forward(self):
        self.operator.run(
            storage=self.storage.step(),
            input_composition_task_key="composition_task",
            input_sub_tasks_keys=["atom_task", "subsequent_task"],
            output_key="runable_label"
        )

if __name__ == "__main__":
    pl = CompositionTaskFilterTest()
    pl.forward()
```

#### 🧾 默认输出格式（Output Format）
最终输出的 DataFrame 只包含经 LLM 判断为可行的任务，并新增一个标签列（默认为 `runable_label`），其值为 1。

| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| ... | ... | 输入数据中的原有字段。 |
| runable_label | int | 模型判断的可行性标签，值为 1 表示可行。 |

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
  "runable_label": 1
}
```
