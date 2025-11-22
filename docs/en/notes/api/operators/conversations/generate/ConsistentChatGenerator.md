---
title: ConsistentChatGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/conversations/generate/consistentchatgenerator/
---

## 📘 Overview

**ConsistentChatGenerator** is an operator designed to synthesize multi-turn dialogue data from scratch. It operates in a two-stage process, generating conversations based on a predefined set of topics and human intents, making it ideal for creating consistent and context-aware conversational datasets.

## `__init__` function

```python
def __init__(self, 
             llm_serving: LLMServingABC = None, 
             num_dialogs_per_intent = 20, 
             num_turns_per_dialog = 6, 
             temperature = 0.9):
```

### init Parameters

| Parameter                | Type          | Default Value | Description                                                          |
| :----------------------- | :------------ | :------------ | :------------------------------------------------------------------- |
| **llm_serving**          | LLMServingABC | None          | The Large Language Model serving instance used for generation.       |
| **num_dialogs_per_intent**| int           | 20            | The number of dialogs to generate for each predefined intent.        |
| **num_turns_per_dialog** | int           | 6             | The number of turns (user and assistant messages) in each dialog.    |
| **temperature**          | float         | 0.9           | The sampling temperature to control the randomness of the generation. |

### Prompt Template Descriptions

| Prompt Template Name | Main Purpose | Applicable Scenarios | Feature Description |
| -------------------- | ------------ | -------------------- | ------------------- |
|                      |              |                      |                     |


## `run` function

```python
def run(self, storage: DataFlowStorage):
```

#### Parameters

| Name        | Type            | Default Value | Description                                                              |
| :---------- | :-------------- | :------------ | :----------------------------------------------------------------------- |
| **storage** | DataFlowStorage | Required      | The data flow storage instance where the generated DataFrame will be written. |

## 🧠 Example Usage

```python
from dataflow.operators.conversations import ConsistentChatGenerator
from dataflow.utils.storage import FileStorage
from dataflow.serving import APILLMServing_request
from dataflow.core import LLMServingABC

class ConsistentChatGeneratorExample:
    def __init__(self, llm_serving: LLMServingABC = None):
        self.storage = FileStorage(
            first_entry_file_name="",
            cache_path="./cache_local",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )

        self.llm_serving = APILLMServing_request(
            api_url="",
            model_name="gpt-4o",
            max_workers=30
        )

        self.generator = ConsistentChatGenerator(
            llm_serving=self.llm_serving,
            num_dialogs_per_intent=20,
            num_turns_per_dialog=6,
            temperature=0.9
        )

    def forward(self):
        self.generator.run(
            storage=self.storage.step()
        )

if __name__ == "__main__":
    pl = ConsistentChatGeneratorExample()
    pl.forward()
```

#### 🧾 Default Output Format

| Field          | Type | Description                                                                  |
| :------------- | :--- | :--------------------------------------------------------------------------- |
| category       | str  | The category or intent of the generated dialogue.                            |
| conversation   | list | A list of dictionaries representing the multi-turn dialogue.                 |

**Example Input:**

This operator generates data from scratch and does not require an input file.

**Example Output:**

```json
{
  "category": "Travel Planning",
  "conversation": [
    {
      "role": "user",
      "value": "I want to plan a 5-day trip to Paris. Can you help me with an itinerary?"
    },
    {
      "role": "assistant",
      "value": "Of course! For a 5-day trip, I'd suggest dedicating the first day to iconic landmarks like the Eiffel Tower and the Louvre Museum. Have you been to Paris before?"
    },
    {
      "role": "user",
      "value": "No, this is my first time. I'd also like to see some less touristy spots if possible."
    },
    {
      "role": "assistant",
      "value": "Great! For a more local experience, you could explore the Le Marais district for its unique shops and historic architecture. On day two, perhaps a visit to Montmartre and the Sacré-Cœur Basilica?"
    }
  ]
}
```
