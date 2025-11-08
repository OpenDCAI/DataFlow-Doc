---
title: ScenarioExpandGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/conversations/generate/scenarioexpander/
---

## 📘 概述

`ScenarioExpandGenerator` 是一个场景扩展算子，它利用大语言模型（LLM）服务，基于输入的原始场景来生成新的或替代的场景。该算子通过重写或改写原有内容，创造出不同版本的场景。

## `__init__`函数

```python
def __init__(self, llm_serving: LLMServingABC):
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行内容生成。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`函数

```python
def run(self, storage: DataFlowStorage, input_scenario_key: str, output_key: str = "modified_scenario"):
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_scenario_key** | str | 必需 | 输入列名，对应原始场景字段。 |
| **output_key** | str | "modified_scenario" | 输出列名，对应生成的新场景字段。 |

## 🧠 示例用法
```python
from dataflow.operators.conversations import ScenarioExpandGenerator
from dataflow.utils.storage import FileStorage
from dataflow.serving import APILLMServing_request
from dataflow.core import LLMServingABC

class ScenarioExpandGeneratorTest:
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

        self.generator = ScenarioExpandGenerator(
            llm_serving=self.llm_serving
        )

    def forward(self):
        self.generator.run(
            storage=self.storage.step(),
            input_scenario_key="original_scenario",
            output_key="modified_scenario"
        )

if __name__ == "__main__":
    pl = ScenarioExpandGeneratorTest()
    pl.forward()
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| [input_scenario_key] | str | 输入的原始场景文本。 |
| modified_scenario | str | 模型生成的替代新场景。 |

示例输入：
```json
{
"original_scenario":"A user is trying to log into their bank account but has forgotten their password."
}
```
示例输出：
```json
{
"original_scenario":"A user is trying to log into their bank account but has forgotten their password.",
"modified_scenario":"A traveling salesperson needs to access their corporate expense report system from a hotel with unreliable Wi-Fi, and their two-factor authentication token has just expired."
}
```
