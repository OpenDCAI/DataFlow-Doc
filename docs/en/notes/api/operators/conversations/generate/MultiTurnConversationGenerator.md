---
title: MultiTurnConversationGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/conversations/generate/multiturnconversationgenerator/
---

## 📘 Overview
The `MultiTurnConversationGenerator` simulates multi-turn conversations based on composition tasks and their sub-task functions using an LLM service. The process involves three agents: User, Assistant, and Tool, interacting to complete the conversation.

## __init__ function
```python
def __init__(self, llm_serving: LLMServingABC):
```
### init parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | Required | LLM serving object implementing the LLMServingABC interface. |

### Prompt Template Descriptions
| Prompt Template Name | Primary Use | Applicable Scenarios | Feature Description |
| --- | --- | --- | --- |
| | | | |

## run function
```python
def run(self, storage: DataFlowStorage, input_task_key: str, input_sub_tasks_keys: list[str], input_functions_key: list[str], output_conversations_key: str = "conversations"):
```
#### Parameters
| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance, responsible for reading and writing data. |
| **input_task_key** | str | Required | Field name for the main task (composition task). |
| **input_sub_tasks_keys** | list[str] | Required | List of field names for sub-tasks. |
| **input_functions_key** | list[str] | Required | Field name containing sub-task functions. |
| **output_conversations_key** | str | "conversations" | Field name for storing the generated conversations. |

## 🧠 Example Usage
```python
from dataflow.operators.conversations import MultiTurnConversationGenerator
from dataflow.utils.storage import FileStorage
from dataflow.serving import APILLMServing_request
from dataflow.core import LLMServingABC

class MultiTurnConversationGeneratorExample:
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

        self.generator = MultiTurnConversationGenerator(
            llm_serving=self.llm_serving
        )

    def forward(self):
        self.generator.run(
            storage=self.storage.step(),
            input_task_key="composition_task",
            input_sub_tasks_keys=["atom_task", "subsequent_task"],
            input_functions_key="functions",
            output_conversations_key="conversations"
        )

if __name__ == "__main__":
    pl = MultiTurnConversationGeneratorExample()
    pl.forward()
```
#### 🧾 Default Output Format
| Field | Type | Description |
| :--- | :--- | :--- |
| (original fields) | - | The original input fields are preserved. |
| conversations | list | A list of dictionaries representing the generated multi-turn conversation. |

**Example Input:**

```json
{
  "composition_task": "Find the airline offering the cheapest fare within a budget of $500 for a round-trip flight from New York to London, departing on November 15th and returning on November 22nd.",
  "atom_task": "Search for a round-trip flight from New York to London, departing on November 15th and returning on November 22nd, with a budget of $500 or less.",
  "subsequent_task": "What is the airline offering the cheapest fare within the budget for this round-trip flight?",
  "functions": "```json\n[\n    {\n        \"sub_task\": \"Search for a round-trip flight from New York to London, departing on November 15th and returning on November 22nd, with a budget of $500 or less.\",\n        \"func_list\": [\n            {\n                \"name\": \"searchFlights\",\n                \"description\": \"Retrieves available flight options for a given route and dates.\",\n                \"parameters\": {\n                    \"departure_city\": {\n                        \"type\": \"string\",\n                        \"description\": \"The city from which the flight will depart.\"\n                    },\n                    \"arrival_city\": {\n                        \"type\": \"string\",\n                        \"description\": \"The city to which the flight will arrive.\"\n                    },\n                    \"departure_date\": {\n                        \"type\": \"string\",\n                        \"description\": \"The date of the departure flight, in YYYY-MM-DD format.\"\n                    },\n                    \"return_date\": {\n                        \"type\": \"string\",\n                        \"description\": \"The date of the return flight, in YYYY-MM-DD format.\"\n                    },\n                    \"max_budget\": {\n                        \"type\": \"number\",\n                        \"description\": \"The maximum budget for the flight, in USD.\"\n                    }\n                },\n                \"required\": [\"departure_city\", \"arrival_city\", \"departure_date\", \"return_date\", \"max_budget\"],\n                \"responses\": {\n                    \"flights\": {\n                        \"type\": \"array\",\n                        \"description\": \"A list of flights within the specified budget, each containing flight details.\"\n                    }\n                }\n            }\n        ]\n    },\n    {\n        \"sub_task\": \"What is the airline offering the cheapest fare within the budget for this round-trip flight?\",\n        \"func_list\": []\n    }\n]\n```"
}
```

**Example Output:**

```json
{
  "composition_task": "Find the airline offering the cheapest fare within a budget of $500 for a round-trip flight from New York to London, departing on November 15th and returning on November 22nd.",
  "atom_task": "Search for a round-trip flight from New York to London, departing on November 15th and returning on November 22nd, with a budget of $500 or less.",
  "subsequent_task": "What is the airline offering the cheapest fare within the budget for this round-trip flight?",
  "functions": "```json\n[\n    {\n        \"sub_task\": \"Search for a round-trip flight from New York to London, departing on November 15th and returning on November 22nd, with a budget of $500 or less.\",\n        \"func_list\": [\n            {\n                \"name\": \"searchFlights\",\n                \"description\": \"Retrieves available flight options for a given route and dates.\",\n                \"parameters\": {\n                    \"departure_city\": {\n                        \"type\": \"string\",\n                        \"description\": \"The city from which the flight will depart.\"\n                    },\n                    \"arrival_city\": {\n                        \"type\": \"string\",\n                        \"description\": \"The city to which the flight will arrive.\"\n                    },\n                    \"departure_date\": {\n                        \"type\": \"string\",\n                        \"description\": \"The date of the departure flight, in YYYY-MM-DD format.\"\n                    },\n                    \"return_date\": {\n                        \"type\": \"string\",\n                        \"description\": \"The date of the return flight, in YYYY-MM-DD format.\"\n                    },\n                    \"max_budget\": {\n                        \"type\": \"number\",\n                        \"description\": \"The maximum budget for the flight, in USD.\"\n                    }\n                },\n                \"required\": [\"departure_city\", \"arrival_city\", \"departure_date\", \"return_date\", \"max_budget\"],\n                \"responses\": {\n                    \"flights\": {\n                        \"type\": \"array\",\n                        \"description\": \"A list of flights within the specified budget, each containing flight details.\"\n                    }\n                }\n            }\n        ]\n    },\n    {\n        \"sub_task\": \"What is the airline offering the cheapest fare within the budget for this round-trip flight?\",\n        \"func_list\": []\n    }\n]\n```",
  "conversations": [
    {
      "role": "system",
      "content": "\n        You are simulating the role of an expert in using functions (i.e\n        ., tools) to solve users' tasks. You already possess\n        knowledge on how to decompose the task into subtasks and\n        understand which tools to use for their resolution.\n        **Subtasks**\n        {'atom_task': 'Search for a round-trip flight from New York to London, departing on November 15th and returning on November 22nd, with a budget of $500 or less.', 'subsequent_task': 'What is the airline offering the cheapest fare within the budget for this round-trip flight?'}\n        **Available Functions for Subtasks**\n        ```json\n[\n    {\n        \"sub_task\": \"Search for a round-trip flight from New York to London, departing on November 15th and returning on November 22nd, with a budget of $500 or less.\",\n        \"func_list\": [\n            {\n                \"name\": \"searchFlights\",\n                \"description\": \"Retrieves available flight options for a given route and dates.\",\n                \"parameters\": {\n                    \"departure_city\": {\n                        \"type\": \"string\",\n                        \"description\": \"The city from which the flight will depart.\"\n                    },\n                    \"arrival_city\": {\n                        \"type\": \"string\",\n                        \"description\": \"The city to which the flight will arrive.\"\n                    },\n                    \"departure_date\": {\n                        \"type\": \"string\",\n                        \"description\": \"The date of the departure flight, in YYYY-MM-DD format.\"\n                    },\n                    \"return_date\": {\n                        \"type\": \"string\",\n                        \"description\": \"The date of the return flight, in YYYY-MM-DD format.\"\n                    },\n                    \"max_budget\": {\n                        \"type\": \"number\",\n                        \"description\": \"The maximum budget for the flight, in USD.\"\n                    }\n                },\n                \"required\": [\"departure_city\", \"arrival_city\", \"departure_date\", \"return_date\", \"max_budget\"],\n                \"responses\": {\n                    \"flights\": {\n                        \"type\": \"array\",\n                        \"description\": \"A list of flights within the specified budget, each containing flight details.\"\n                    }\n                }\n            }\n        ]\n    },\n    {\n        \"sub_task\": \"What is the airline offering the cheapest fare within the budget for this round-trip flight?\",\n        \"func_list\": []\n    }\n]\n```\n        Please use the tools provided above to answer the question posed\n        by \"<human>\". You must try as much as possible to use these\n        tools, instead of directly answering the question using your\n        prior knowledge.\n        Your response must obey the following format:\n        Observation: Carefully observe the user \"<human>\"'s question as\n        well as the output of the function call (often enclosed\n        within the \"<func_return>\" tag). Be sure to check for any\n        errors in previous outputs, as they may not always be\n        accurate. Enclose your observation within the \"<observation>\"\n        tag.\n        Thought: After observing and combining the previously listed\n        steps, give detailed and clear thoughts, reasonings, or\n        reflections, and according to the plan decide the next step.\n        Function Call: Name and arguments of the function call. The\n        function name must be same as its name in above function list\n        , and the arguments must obey the format required by the\n        function. Enclose the function call within the \"<func_call>\"\n        tag. If possible, you can call multiple functions in parallel\n        , be sure the functions called  parallelly are independent of\n        each other.\n        Final Answer: When you believe the task is complete, you may\n        use 'final_answer' to provide a detailed summary of the\n        results to give to the user, enclose the final answer within\n        the tag \"<final>\".\n        Example 1 (regular function call):\n        <observation> User has provided two numbers - 15 and 25. <\/\n        observation>\n        <thought> Based on user's request, we need to find the greatest\n        common divisor of these two numbers. We can use the function\n        'find_greatest_common_divisor' to solve this problem. <\/\n        thought>\n        <func_call>[\n        {\n        \"name\": \"find_greatest_common_divisor\",\n        \"arguments\": {\"num1\": 15, \"num2\": 25}\n        }\n        ]<\/func_call>\n        Example 2 (parallel function call):\n        <observation> User wants to know the weather in two cities - New\n        York and London. <\/observation>\n        <thought> We can use the function 'get_weather' to find the\n        weather in New York and London. And the call to this function\n        can be done in parallel. <\/thought>\n        <func_call>[\n        {\n        \"name\": \"get_weather\",\n        \"arguments\": {\"city\": \"New York\"}\n        },\n        {\n        \"name\": \"get_weather\",\n        \"arguments\": {\"city\": \"London\"}\n        }\n        ]<\/func_call>\n        Furthermore, when the user \"<human>\" raises a question, you need\n        to provide a structured plan to solve the question ('\n        structured' means that the plan needs to include steps in\n        sequential order, such as Step 1, 2, 3, etc., or logic\n        processes that include loops and decision branches). The\n        contents of the plan can be placed in the first round\n        response's <thought>, and try as much as possible to follow\n        this plan in every subsequent function call. However, as\n        necessary, you may also modify the relevant plans according\n        to the result of the function call.\n        "
    },
    {
      "role": "user",
      "content": "<human> Hi there! I'm planning a round-trip from New York to London, departing on November 15th and returning on November 22nd. I'm searching for an airline offering the cheapest fare, but I need it to fit my budget, which is $500 or less. Can you help me find the best option available? I'm particularly concerned about the price, but I'm open to different airlines or travel times if it helps in staying within budget. Thanks!<\/human>"
    },
    {
      "role": "assistant",
      "content": "<observation> The user is looking for a round-trip flight from New York to London, departing on November 15th and returning on November 22nd, with a budget of $500 or less. <\/observation>\n<thought> In order to assist the user, we need to find available flight options within their specified budget. To achieve this, we'll use the 'searchFlights' function to retrieve a list of flights from New York to London that fall within a $500 budget. After obtaining the flight options, we'll identify the airline offering the cheapest fare. <\/thought>\n<func_call>[\n{\n    \"name\": \"searchFlights\",\n    \"arguments\": {\n        \"departure_city\": \"New York\",\n        \"arrival_city\": \"London\",\n        \"departure_date\": \"2023-11-15\",\n        \"return_date\": \"2023-11-22\",\n        \"max_budget\": 500\n    }\n}\n]<\/func_call>"
    },
    {
      "role": "assistant",
      "content": "<func_return>[\n    {\n        \"available_flights\": [\n            {\n                \"flight_number\": \"AB123\",\n                \"airline\": \"Airline A\",\n                \"departure_time\": \"10:00 AM\",\n                \"arrival_time\": \"10:00 PM\",\n                \"price\": 450\n            },\n            {\n                \"flight_number\": \"XY456\",\n                \"airline\": \"Airline B\",\n                \"departure_time\": \"11:00 AM\",\n                \"arrival_time\": \"11:00 PM\",\n                \"price\": 470\n            }\n        ]\n    }\n]<\/func_return>"
    },
    {
      "role": "assistant",
      "content": "<observation> The search for available flights within the specified budget has returned two options:\n\n1. Airline A: Flight AB123, departing at 10:00 AM and arriving at 10:00 PM, priced at $450.\n2. Airline B: Flight XY456, departing at 11:00 AM and arriving at 11:00 PM, priced at $470. <\/observation>\n\n<thought> The cheapest fare within the $500 budget is offered by Airline A, with a flight priced at $450. This flight departs New York at 10:00 AM and arrives in London at 10:00 PM. I will now provide this information as the final recommendation to the user. <\/thought>\n\n<final> The cheapest fare for your trip from New York to London within your budget of $500 is offered by Airline A. The flight details are as follows: \n- Flight Number: AB123\n- Departure: 10:00 AM from New York\n- Arrival: 10:00 PM in London\n- Price: $450\n\nThis option fits your budget and is the least expensive among the available choices. <\/final>"
    }
  ]
}
```
