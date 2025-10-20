---
title: ScenarioExtractor
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/conversations/generate/scenarioextractor/
---

# 📘 Overview

The `ScenarioExtractor` is an operator designed to extract scenario information from conversation content. It utilizes a large language model (LLM) service to analyze dialogues and generate corresponding scenario descriptions.

## `__init__`

```python
def __init__(self, llm_serving: LLMServingABC)
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | Required | An instance of a large language model service, used for analysis and generation. |

### Prompt Template Descriptions

| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## `run`

```python
def run(self, storage: DataFlowStorage, input_chat_key: str, output_key: str = "scenario")
```

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The data flow storage instance, responsible for reading and writing data. |
| **input_chat_key** | str | Required | The input column name corresponding to the conversation content field. |
| **output_key** | str | "scenario" | The output column name for the extracted scenario. |

## 🧠 Example Usage

```python

```

#### 🧾 Default Output Format

| Field | Type | Description |
| :--- | :--- | :--- |
| *input_chat_key* | str | The input conversation text. |
| **scenario** | str | The extracted scenario from the conversation. |

**Example Input:**
(Assuming `input_chat_key` is "dialogue")

```json
{
  "dialogue": "User: I'd like to book a flight from New York to Los Angeles for next Tuesday. Bot: Sure, I can help with that. What is your preferred departure time?"
}
```

**Example Output:**

```json
{
  "dialogue": "User: I'd like to book a flight from New York to Los Angeles for next Tuesday. Bot: Sure, I can help with that. What is your preferred departure time?",
  "scenario": "Flight Booking"
}
```
