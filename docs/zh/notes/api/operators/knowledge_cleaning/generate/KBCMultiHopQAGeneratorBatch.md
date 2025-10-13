---
title: KBCMultiHopQAGeneratorBatch
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/knowledge_cleaning/generate/kbcmultihopqageneratorbatch/
---

## 📘 概述
[KBCMultiHopQAGeneratorBatch](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) 是一个多跳问答（Multi-hop QA）对生成算子，用于从给定的文本数据中，自动生成需要多步推理才能解答的问题与答案。该算子通过调用大语言模型（LLM），将原始文本转换为结构化的问答数据，适用于构建复杂的问答数据集或知识库增强。

## __init__函数
```python
def __init__(self,
             llm_serving: LLMServingABC,
             seed: int = 0,
             lang="en",
             prompt_template = None
             ):
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :--------------------------------- | :------------------------------ |
| **llm_serving** | LLMServingABC | 必需 | 大语言模型服务实例，用于执行推理与生成。 |
| **seed** | int | 0 | 随机种子，用于确保生成过程的可复现性。 |
| **lang** | str | "en" | 语言设置，用于指定生成问答对的语言（如 "en" 或 "zh"）。 |
| **prompt_template** | PromptABC | Text2MultiHopQAGeneratorPrompt | 提示词模板对象，用于构建生成多跳问答的输入。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
| **Text2MultiHopQAGeneratorPrompt** | 从文本生成多跳问答对 | 需要从大段上下文中构建复杂推理问题的场景 | 内置专用模板，引导模型生成问题、推理步骤、最终答案和支撑事实，确保输出的结构化和逻辑性。 |

## run函数
```python
def run(
        self,
        input_key: str = 'chunk_path',
        output_key: str = 'enhanced_chunk_path',
        storage: DataFlowStorage = None,
):
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_key** | str | "chunk_path" | 输入列名，该列包含存储待处理文本块的JSON或JSONL文件路径。 |
| **output_key** | str | "enhanced_chunk_path" | 输出列名，该列将存储已添加多跳问答对的增强文件路径。 |

## 🧠 示例用法


#### 🧾 默认输出格式（Output Format）
算子会读取 `input_key` 指定路径文件中的文本，生成问答对后，将包含问答对的完整数据写回原文件。
| 字段 | 类型 | 说明 |
| :-------------- | :---- | :---------- |
| text | str | 原始上下文文本。 |
| qa_pairs | list | 生成的多跳问答对列表，每个元素是一个包含问题、答案、推理步骤等的字典。 |

示例输入文件 (`chunk_path` 指向的文件内容):
```json
{
"cleaned_chunk":"The Eiffel Tower is located in Paris, the capital of France. The Louvre Museum, also in Paris, is the world's largest art museum."
}
```
示例输出文件 (算子执行后，原文件被更新为):
```json
{
"cleaned_chunk": "The Eiffel Tower is located in Paris, the capital of France. The Louvre Museum, also in Paris, is the world's largest art museum.",
"qa_pairs": [
    {
      "question": "In which country is the world's largest art museum located?",
      "reasoning_steps": [
        {"step": "The text states the Louvre Museum is the world's largest art museum."},
        {"step": "The text also states the Louvre Museum is in Paris."},
        {"step": "Paris is identified as the capital of France."}
      ],
      "answer": "France",
      "supporting_facts": [
        "The Louvre Museum, also in Paris, is the world's largest art museum.",
        "Paris, the capital of France."
        ],
      "type": "Geography"
    }
  ]
}
```
