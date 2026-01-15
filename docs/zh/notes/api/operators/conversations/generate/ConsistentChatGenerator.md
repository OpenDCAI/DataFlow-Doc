---
title: ConsistentChatGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/conversations/generate/consistentchatgenerator/
---

## 📘 概述
`ConsistentChatGenerator` 是一个多轮对话数据生成算子，它根据预置的主题和人类意图，分两个阶段从零开始合成对话数据。

## \_\_init\_\_函数
```python
def __init__(self, llm_serving: LLMServingABC = None, num_dialogs_per_intent = 20, num_turns_per_dialog = 6, temperature = 0.9, , prompt_template : Union[ConsistentChatPrompt, DIYPromptABC] = None)
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :----------------------- | :-------------- | :------- | :----------------------------- |
| **llm_serving** | LLMServingABC | None | LLM服务对象，需实现LLMServingABC接口。 |
| **num_dialogs_per_intent** | int | 20 | 每个意图生成的对话数量。 |
| **num_turns_per_dialog** | int | 6 | 每个对话的轮次数量。 |
| **temperature** | float | 0.9 | 生成温度，控制输出随机性。 |
| **prompt_template** | Union[ConsistentChatPrompt, DIYPromptABC] | None | prompt模板，支持自定义 |

### Prompt模板说明

包括query和response

#### query
```python
Task Description and Rules 
            1. Generate multiple rounds of realistic user questions based on the provided topic: 
            - Based on a single core topic (provided directly by the user), generate multiple rounds of realistic user questions, comprising 6-8 turns in total. 
            - The questions should match the characteristics of real users in natural communication: sometimes simple, sometimes vague, or including contextual backgrounds, and should reflect the language style of daily communication. 
            - Note: Avoid directly including the exact expression of the input topic in the questions. Instead, abstract it with natural and conversational language in practical scenarios. 
            
            2. Dynamic Dialogue Information Flow in Conversations: Below are the relevant steps of the information flow: {info_flow}

            The dialogue style should adhere to the following requirements: 
            - Utilize natural phrasing and vivid language, avoiding overly mechanical responses. 
            - Favor shorter sentences in questions, with occasional subject omission allowed. 
            - Ensure smooth and logical transitions through lighthearted or entertaining interjections. 
            - Permit the expression of specific personality traits and individualized tones. 
            - Proactively introduce new topics when appropriate, ensuring relevance to the current theme. 
            
            The dialogue should comply with the following generation rules: 
            - For each round of dialogue, only simulate user questions without providing answers. 
            - Ensure the conversation flows naturally and reflects realistic interactive thinking. 
            - Avoid overly polished or templated content, ensuring the questions feel authentic and relatable in life scenarios. 
            
            Output Format: 
            Multi-turn Questions in JSON Format: 
            "category": "<Core Topic of the Conversation>", 
            "turns": ["<turn_1>", "<turn_2>", "<turn_3>", "..."] 
            To generate multi-turn queries with high topic consistency, please think step-by-step. 
            The input core topic for this task is: {topic}
```

#### response

```python
Your task is to simulate a multi-turn conversation where you progressively answer a series of user questions provided under a given topic category. For each answer, focus on delivering a natural, contextually relevant, and actionable response while considering both the current question and future questions in the sequence. The goal is to ensure consistency and logical progression throughout the dialogue and to avoid unnecessary follow-up questions in the responses simultaneously. To generate multi-turn responses with high topic consistency, think step-by-step. Key Dialogue Style Requirements are as follows: 
Content and Structure:
1. Directly Answer the Current Question:
- Provide a complete, useful response to the current question without posing additional questions unless they are directly relevant to future queries. 
- If clarification or additional steps are needed, frame these as suggestions or explanations rather than questions.
2. Be Context-Aware:
- Always tailor each response to the current question while remaining mindful of the context provided by prior and future questions.
- Avoid prematurely addressing future queries but create subtle links where necessary to ensure smooth progression.
3. Clear, Action-Oriented Responses:
- Focus on providing actionable advice, logical explanations, or troubleshooting steps rather than speculative or rhetorical remarks.
- Avoid long or overly complex explanations; aim for clarity and efficiency.
Tone and Style:
1. Conversational and Supportive:
- Use a natural, empathetic tone that simulates real-life problem-solving interactions.
- Avoid mechanical or overly formal responses.
2. Economical with Words:
- Keep responses concise but informative. Minimize extraneous content while ensuring answers have enough detail to be helpful.
3. No Unnecessary Questions:
- Limit unnecessary questions in the responses and focus instead on providing actionable steps or solutions directly. Avoid follow-up questions that don’t align with the next user query.
Turn-by-Turn Instructions:
1. Answer Exclusively for the Current Question:
- For each turn, generate an answer that directly addresses the immediate question. Avoid revisiting past details unnecessarily unless they are highly relevant.
- While you shouldn’t anticipate or directly answer future queries, your response should create natural openings for upcoming questions if applicable.
2. Avoid Irrelevant Follow-Up Questions:
- If the immediate question doesn’t require clarification, frame your response as a statement or suggestion rather than a question.
- Maintain alignment with the logical flow of dialogue to ensure each turn is coherent.
3. Proactively Provide Scenarios or Steps:
- Where appropriate, guide the user with specific recommendations, troubleshooting actions, or observations they can make without requiring back-and-forth clarification.
Output Requirements:
The output must simulate the conversation by only providing responses (one per turn) in a sequential manner. The final format must strictly adhere to valid JSON and include the required structure.

The input core topic and questions-only turns for this task is: 
core topic: {topic}
queries:
{', '.join([f'User query: {query}' for query in queries])}
```

## run函数
```python
def run(self, storage: DataFlowStorage)
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :---------- | :---------------- | :--- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责写入生成的数据。 |

## 🧠 示例用法
```python
from dataflow.operators.conversations import ConsistentChatGenerator
from dataflow.utils.storage import FileStorage
from dataflow.serving import APILLMServing_request
from dataflow.core import LLMServingABC

class ConsistentChatGeneratorTest:
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
    pl = ConsistentChatGeneratorTest()
    pl.forward()
```
#### 🧾 默认输出格式（Output Format）
| 字段 | 类型 | 说明 |
| :------------- | :---- | :--------------------------------------------------------- |
| category | str | 对话所属的类别或意图。 |
| conversation | list | 多轮对话列表，每个元素是一个包含 "role" 和 "value" 的字典。 |
