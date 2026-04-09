---
title: Text2MultiHopQAGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/core_text/generate/text2multihopqagenerator/
---

## 📘 概述
`Text2MultiHopQAGenerator` 是一个多跳问答对生成算子，用于从给定的文本中自动生成需要多步推理才能回答的问题与答案。该算子通过调用大语言模型（LLM），将输入文本转化为一系列结构化的、包含推理步骤的多跳问答对，适用于构建复杂的问答数据集或评估模型的推理能力。

> **输出校验：** 生成完成后，算子会自动过滤掉 `output_key`（QA 对列表）为空或非有效列表的行，确保输出中仅包含成功生成的结果。被过滤的行数会记录在日志中，便于追踪。

## __init__函数
`__init__(self, llm_serving, seed=0, lang="en", prompt_template=None, num_q=5)`

### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :----------------------------------- | :--------------------------------------------- |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行推理与生成。 |
| **seed** | int | 0 | 随机数种子，用于保证结果的可复现性。 |
| **lang** | str | "en" | 指定生成内容的语言，例如 'en' (英语) 或 'zh' (中文)。 |
| **prompt_template** | PromptABC | Text2MultiHopQAGeneratorPrompt() | 提示词模板对象，用于构建生成任务的输入。 |
| **num_q** | int | 5 | 为每个输入文本生成的问题答案对数量上限。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
| **Text2MultiHopQAGeneratorPrompt** | 从文本生成多跳问答对 | 需要从大段上下文中构建复杂推理问题的场景 | 内置专用模板，引导模型生成问题、推理步骤、最终答案和支撑事实，确保输出的结构化和逻辑性。 |

## run函数
`run(self, storage, input_key='cleaned_chunk', output_key='QA_pairs', output_meta_key='QA_metadata')`

#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :---------------- | :---------------- | :---------------- | :--------------------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | "cleaned_chunk" | 输入列名，对应包含上下文文本的字段。 |
| **output_key** | str | "QA_pairs" | 输出列名，对应生成的多跳问答对列表。 |
| **output_meta_key** | str | "QA_metadata" | 输出元数据列名，对应生成的元数据信息。 |

## 🧠 示例用法
```python
self.knowledge_cleaning_step4 = Text2MultiHopQAGenerator(
    llm_serving=self.llm_serving,
    lang="en",
    num_q = 5
)
self.knowledge_cleaning_step4.run(
    storage=self.storage.step(),
    # input_key=
    # output_key=
)
```

#### 🧾 默认输出格式（Output Format）

> **注意：** 生成的 `QA_pairs` 为空或非有效列表的行会被自动移除，输出的 DataFrame 索引会被重置。如有行被过滤，将在日志中记录过滤数量。

| 字段 | 类型 | 说明 |
| :------------- | :----------------- | :--------------------------------------- |
| text | str | 处理后的原始上下文文本。 |
| qa_pairs | List[Dict] | 生成的多跳问答对列表，每个元素包含问题、答案、推理步骤等（保证非空）。 |
| metadata | Dict | 包含数据来源、时间戳、复杂度等信息的元数据。 |

示例输入：
```json
{
"cleaned_chunk":"Mona Lisa was painted by Leonardo da Vinci. Leonardo da Vinci was born in the Republic of Florence. The Republic of Florence was a state in what is now Italy."
}
```
示例输出：
```json
{
    "cleaned_chunk": "Mona Lisa was painted by Leonardo da Vinci. Leonardo da Vinci was born in the Republic of Florence. The Republic of Florence was a state in what is now Italy.",
    "QA_pairs": [
        {
            "question": "In which modern country was the painter of the Mona Lisa born?",
            "reasoning_steps": [
                {
                    "step": "Identify the painter of the Mona Lisa, which is Leonardo da Vinci."
                },
                {
                    "step": "Find the birthplace of Leonardo da Vinci, which is the Republic of Florence."
                },
                {
                    "step": "Determine the modern-day location of the Republic of Florence, which is Italy."
                }
            ],
            "answer": "Italy",
            "supporting_facts": [
                "Mona Lisa was painted by Leonardo da Vinci.",
                "Leonardo da Vinci was born in the Republic of Florence.",
                "The Republic of Florence was a state in what is now Italy."
            ],
            "type": "History"
        }
    ],
    "QA_metadata": {
        "source": "default_source",
        "timestamp": "2023-10-27T10:00:00Z",
        "complexity": 3
    }
}
```
