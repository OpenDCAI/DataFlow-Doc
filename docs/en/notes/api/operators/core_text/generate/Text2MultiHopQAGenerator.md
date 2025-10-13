---
title: Text2MultiHopQAGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/core_text/generate/text2multihopqagenerator/
---

## 📘 Overview
`Text2MultiHopQAGenerator` is a processor designed to automatically generate multi-hop question-answer pairs from input text. It handles the entire pipeline, from text preprocessing to generating structured QA data, leveraging a large language model (LLM) for the generation process.

## `__init__` function
```python
def __init__(self,
             llm_serving: LLMServingABC,
             seed: int = 0,
             lang="en",
             prompt_template=None,
             num_q=5
             ):
```
| Parameter | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | Required | Large language model serving instance for inference and generation. |
| **seed** | int | 0 | Random seed for reproducibility. |
| **lang** | str | "en" | Language of the text and generated QA pairs. |
| **prompt_template** | PromptABC | `Text2MultiHopQAGeneratorPrompt()` | Prompt template object for constructing model inputs. |
| **num_q** | int | 5 | The number of question-answer pairs to generate per text. |

### Prompt Template Descriptions
| Prompt Template Name | Main Purpose | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| **Text2MultiHopQAGeneratorPrompt** | | | |

## `run` function
```python
def run(self,
        storage: DataFlowStorage,
        input_key: str = 'cleaned_chunk',
        output_key: str = 'QA_pairs',
        output_meta_key: str = 'QA_metadata'
        ):
```
| Parameter | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance for reading and writing data. |
| **input_key** | str | "cleaned_chunk" | Input column name, corresponding to the text field. |
| **output_key** | str | "QA_pairs" | Output column name for the generated QA pairs. |
| **output_meta_key** | str | "QA_metadata" | Output column name for the metadata of the generated QA pairs. |

## 🧠 Example Usage
```python

```

#### 🧾 Default Output Format (Output Format)
| Column Name (Default) | Type | Description |
| :--- | :--- | :--- |
| `cleaned_chunk` (input) | str | The original input text. |
| `QA_pairs` (output) | List[Dict] | A list containing the generated multi-hop QA pairs. |
| `QA_metadata` (output) | Dict | A dictionary containing metadata about the generated data. |

Example Input:
```json
{
"cleaned_chunk":"<raw input context>"
}
```
Example Output:
```json
{
"cleaned_chunk":"<raw input context>",
"QA_pairs": [
    {
      "question": "<string: generated question>",
      "reasoning_steps": [
        {"step": "<inference step 1>"},
        {"step": "<inference step 2>"}
      ],
      "answer": "<string: final answer>",
      "supporting_facts": ["<fact 1>", "<fact 2>"],
      "type": "<optional string: QA category>"
    }
  ],
"QA_metadata": {
    "source": "<source string>",
    "timestamp": "<timestamp string>",
    "complexity": "<integer: reasoning complexity>"
  }
}
```
