---
title: MetaSampleEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_pt/eval/metasampleevaluator/
---

## 📘 概述 [MetaSampleEvaluator]
`MetaSampleEvaluator` 是一个通过大语言模型（LLM）评估文本多个元属性的算子。它能够根据用户定义的维度，对文本的结构、多样性、流畅性、安全性、教育价值以及内容准确性等方面进行打分。

## `__init__`函数
```python
def __init__(self, 
             llm_serving: LLMServingABC = None,
             dimensions: list[dict] = example_dimensions,
            ):
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **llm_serving** | LLMServingABC | None | 大语言模型服务实例，需实现LLMServingABC接口。 |
| **dimensions** | list[dict] | example_dimensions | 评估维度列表。每个维度是一个字典，包含维度名称、描述和示例列表。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
| | | | |

## `run`函数
```python
def run(self, storage: DataFlowStorage, input_key: str):
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | 必需 | 输入列名，对应待评估文本的字段。 |

## 🧠 示例用法

```python
from dataflow.operators.text_pt.eval import MetaSampleEvaluator
from dataflow.utils.storage import FileStorage
from dataflow.utils.llm_serving import APILLMServing_request

# 准备数据和存储
storage = FileStorage(first_entry_file_name="pt_input.jsonl")

# 初始化 LLM 服务
llm_serving = APILLMServing_request(
    api_url="http://<your_llm_api_endpoint>",
    model_name="<your_model_name>"
)

# 初始化并运行算子
meta_evaluator = MetaSampleEvaluator(llm_serving=llm_serving)
meta_evaluator.run(
    storage.step(),
    input_key='raw_content'
)
```

## 🧾 默认输出格式（Output Format）
算子执行后，会在输入的 DataFrame 基础上追加每个评估维度的得分列。
| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| ... | - | 输入的原始字段。 |
| Text Structure | float | 文本结构维度的得分。 |
| Diversity and Complexity | float | 多样性与复杂性维度的得分。 |
| Fluency and Understandability | float | 流畅性与可理解性维度的得分。 |
| Safety | float | 安全性维度的得分。 |
| Educational Value | float | 教育价值维度的得分。 |
| Content Accuracy and Effectiveness | float | 内容准确性与有效性维度的得分。 |

示例输入：
```json
{
  "raw_content": "AMICUS ANTHOLOGIES, PART ONE (1965-1972)\nFebruary 23, 2017 Alfred Eaker Leave a comment\nWith Dr. Terror's House of Horrors (1965, directed by Freddie Francis and written by Milton Subotsky) Amicus Productions (spearheaded by Subotsky and Max Rosenberg, who previously produced for Hammer and was a cousin to Doris Wishman) established itself as a vital competitor to Hammer Studios..."
}
```
示例输出：
```json
{
  "raw_content": "AMICUS ANTHOLOGIES, PART ONE (1965-1972)\nFebruary 23, 2017 Alfred Eaker Leave a comment\nWith Dr. Terror's House of Horrors (1965, directed by Freddie Francis and written by Milton Subotsky) Amicus Productions (spearheaded by Subotsky and Max Rosenberg, who previously produced for Hammer and was a cousin to Doris Wishman) established itself as a vital competitor to Hammer Studios...",
  "Text Structure": 4.0,
  "Diversity and Complexity": 5.0,
  "Fluency and Understandability": 4.0,
  "Safety": 5.0,
  "Educational Value": 5.0,
  "Content Accuracy and Effectiveness": 5.0
}
```
