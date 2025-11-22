---
title: FuncCallConversationSampleEvaluator
createTime: 2025/11/08 12:00:00
permalink: /zh/api/operators/conversations/eval/funccallconversationsampleevaluator/
---

## 📘 概述
[FuncCallConversationSampleEvaluator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/conversations/eval/func_call_conversation_sample_evaluator.py) 是一个对话样本打分评估算子。它将 DataFrame 中的多轮对话重组为评分 Prompt，调用大语言模型（LLM）输出 JSON 格式评分，并解析提取 `score` 写回存储。

## __init__函数
```python
def __init__(self, llm_serving: LLMServingABC)
```

### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | 必需 | LLM服务对象，需实现LLMServingABC接口。 |

### Prompt模板说明
| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| ConversationEvalPrompt | 对对话进行客观维度打分 | 数据生成质量评估、过滤、排序 | 产出JSON评分，解析稳健，失败回退为0 |

## run函数
```python
def run(self, storage: DataFlowStorage, input_conversation_key: str = "conversations", output_score_key = "score")
```

#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_conversation_key** | str | `"conversations"` | 输入列名，对应多轮对话字段。 |
| **output_score_key** | str | `"score"` | 输出列名，对应对话评分字段。 |

## 🧠 示例用法
```python
from dataflow.operators.conversations import FuncCallConversationSampleEvaluator
from dataflow.utils.storage import FileStorage
from dataflow.serving import APILLMServing_request
from dataflow.core import LLMServingABC

class ConversationEvaluatorExample:
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

        self.evaluator = FuncCallConversationSampleEvaluator(
            llm_serving=self.llm_serving
        )

    def forward(self):
        self.evaluator.run(
            storage=self.storage.step(),
            input_conversation_key="conversations",
            output_score_key="score"
        )

if __name__ == "__main__":
    pl = ConversationEvaluatorExample()
    pl.forward()
```

#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| ... | ... | 输入数据中的原有字段。 |
| conversations | list | 多轮对话列表，每个元素包含 `role` 与 `content` 字段。 |
| score | int | 评估分数（解析失败时为0）。 |

示例输入：
```json
{
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

示例输出：
```json
{
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
  ],
  "score": 5
}
```

