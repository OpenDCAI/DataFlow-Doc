---
title: KBCMultiHopQAGeneratorBatch
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/knowledge_cleaning/generate/kbcmultihopqageneratorbatch/
---

## 📘 Overview

[KBCMultiHopQAGeneratorBatch](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) is a processor for generating multi-hop question-answer pairs from user data. This class handles the processing of text data to generate multi-hop question-answer pairs using an AI model. It manages the entire pipeline from text preprocessing to dataset curation.

## __init__ function

```python
def __init__(self,
             llm_serving: LLMServingABC,
             seed: int = 0,
             lang="en",
             prompt_template = None
             ):
```

| Parameter | Type | Default Value | Description |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **llm_serving** | LLMServingABC | Required | Large language model serving instance for executing inference and generation. |
| **seed** | int | 0 | The random seed for reproducibility. |
| **lang** | str | "en" | The language of the text to be processed. |
| **prompt_template** | PromptABC | Text2MultiHopQAGeneratorPrompt | The prompt template object used to construct the input. |

### Prompt Template Descriptions

| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
| | | | |

## run function

```python
def run(self,
        input_key: str = 'chunk_path',
        output_key: str = 'enhanced_chunk_path',
        storage: DataFlowStorage = None,
    ):
```

| Parameter | Type | Default Value | Description |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | Required | The DataFlow storage instance, responsible for reading and writing data. |
| **input_key** | str | "chunk_path" | The name of the input column, corresponding to the file path of the text chunks. |
| **output_key** | str | "enhanced_chunk_path" | The name of the output column, where the path to the enhanced file will be stored. |

## 🧠 Example Usage

```python

```

#### 🧾 Default Output Format

| Field | Type | Description |
| :-------------- | :---- | :---------- |
| text | str | The input text context. |
| qa_pairs | list | A list of generated question-answer pairs. |

Example Input (content of the file specified by `input_key`):

```json
[
    {
        "cleaned_chunk": "The capital of France is Paris. Paris is famous for the Eiffel Tower, which was completed in 1889."
    }
]
```

Example Output (updated content of the same file):

```json
[
    {
        "cleaned_chunk": "The capital of France is Paris. Paris is famous for the Eiffel Tower, which was completed in 1889.",
        "qa_pairs": {
            "text": "The capital of France is Paris. Paris is famous for the Eiffel Tower, which was completed in 1889.",
            "qa_pairs": [
                {
                    "question": "In which city can you find the landmark that was completed in 1889?",
                    "reasoning_steps": [
                        {
                            "step": "The text states the Eiffel Tower was completed in 1889."
                        },
                        {
                            "step": "The text also states that Paris is famous for the Eiffel Tower."
                        },
                        {
                            "step": "Therefore, the landmark completed in 1889 is in Paris."
                        }
                    ],
                    "answer": "Paris",
                    "supporting_facts": [
                        "Paris is famous for the Eiffel Tower",
                        "the Eiffel Tower, which was completed in 1889"
                    ],
                    "type": "multi-hop"
                }
            ],
            "metadata": {
                "source": "default_source",
                "timestamp": "...",
                "complexity": 2
            }
        }
    }
]
```
