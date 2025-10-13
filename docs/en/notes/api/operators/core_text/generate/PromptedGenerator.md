---
title: PromptedGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/core_text/generate/promptedgenerator/
---

## 📘 PromptedGenerator
PromptedGenerator is a data generation operator that produces text based on user-provided prompts. It combines a system prompt with input content from a specified column to generate the desired output text.

## __init__ function
```python
def __init__(self, 
            llm_serving: LLMServingABC, 
            system_prompt: str = "You are a helpful agent.",
            json_schema: dict = None
            )
```
### init Parameter Descriptions
| Parameter | Type | Default Value | Description |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **llm_serving** | LLMServingABC | Required | LLM serving object for executing inference and generation. |
| **system_prompt** | str | "You are a helpful agent." | System prompt to define the model's behavior. |
| **json_schema** | dict | None | Optional JSON schema to constrain the output format. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| -------------------------------- | ------------- | ----------------------- | ----------------------------------------------------- |
| | | | |

## run function
```python
def run(self, storage: DataFlowStorage, input_key: str = "raw_content", output_key: str = "generated_content")
```
#### Parameters
| Name | Type | Default Value | Description |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance, responsible for reading and writing data. |
| **input_key** | str | "raw_content" | Input column name, corresponding to the content field. |
| **output_key** | str | "generated_content" | Output column name, corresponding to the generated content field. |

## 🧠 Example Usage
```python

```

#### 🧾 Default Output Format (Output Format)
| Field | Type | Description |
| :-------------- | :---- | :---------- |
| raw_content | str | The input text content. |
| generated_content | str | The model-generated content. |

Example Input:
```json
{
"raw_content": "Translate the following English text to French: 'Hello, world!'"
}
```
Example Output:
```json
{
"raw_content": "Translate the following English text to French: 'Hello, world!'",
"generated_content": "Bonjour, le monde !"
}
```
