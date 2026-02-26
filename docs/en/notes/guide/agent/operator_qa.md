---
title: Operator QA
createTime: 2026/02/05 22:11:00
permalink: /en/guide/agent/operator_qa/
---

## 1. Overview

**Operator QA** is a built-in vertical domain expert assistant within the DataFlow-Agent platform. Its core mission is to help users quickly navigate the extensive DataFlow operator library to find required tools, understand their usage, and inspect underlying source code.

Unlike generic chatbots, Operator QA integrates **RAG (Retrieval-Augmented Generation)** technology. It is equipped with a complete operator index (FAISS) and a metadata knowledge base of the DataFlow project. When a user asks a question, the Agent autonomously decides whether to retrieve information from the knowledge base, which operators to inspect, and provides accurate technical details—including code snippets and parameter descriptions—back to the user.

## 2. Core Features

This module is driven by a frontend UI (`gradio_app/pages/operator_qa.py`), a backend execution workflow (`dataflow_agent/workflow/wf_operator_qa.py`), and a backend agent (`dataflow_agent/agentroles/data_agents/operator_qa_agent.py`). It possesses the following core capabilities:

### 2.1 Intelligent Retrieval and Recommendation

The Agent does more than simple keyword matching; it identifies user needs based on semantic understanding.

* **Semantic Search**: If a user describes a need like "I want to filter out missing values," the Agent uses vector retrieval to find relevant operators such as `ContentNullFilter`.
* **On-Demand Invocation**: Based on the `BaseAgent` graph mode (`use_agent=True`), the Agent automatically determines whether to call the `search_operators` tool or respond directly based on the conversation context.

### 2.2 Multi-turn Conversation

Utilizing the `AdvancedMessageHistory` module, the system maintains a complete session context.

* **Contextual Memory**: A user can ask, "Which operators can load data?" followed by "How do I fill in **its** parameters?" The Agent can recognize that "its" refers to the operator recommended in the previous turn.
* **State Persistence**: In both script interaction and UI modes, by reusing the same `state` and `graph` instances, the `messages` list accumulates across multiple turns, ensuring the LLM maintains a full memory.

### 2.3 Visualization and Interaction

* **Gradio UI**: Provides code previews, operator highlighting, and quick-question buttons.
* **Interaction**: Supports multi-turn Q&A, clearing history, and viewing history.

## 3. Architectural Components

### 3.1 OperatorQAAgent

* Inherits from `BaseAgent` and is configured in ReAct/Graph mode.
* Possesses Post-Tools permissions to call RAG services for data retrieval.
* Responsible for parsing natural language, planning database queries, and generating final natural language responses.

### 3.2 OperatorRAGService

* A service layer decoupled from the Agent.
* Manages the FAISS vector index and `ops.json` metadata.
* Provides underlying capabilities such as `search` (vector search), `get_operator_info` (fetch details), and `get_operator_source` (fetch source code).

## 4. User Guide

This feature provides two modes of use: the **Graphical Interface (Gradio UI)** and **Command-line Scripts**.

### 4.1 UI Operation

It is ideal for interactive exploration and rapid validation. To launch the web interface:
```python
python gradio_app/app.py
```
Visit `http://127.0.0.1:7860` and start using  

1. **Configure Model**: In the "Configuration" panel on the right, verify the API URL and Key, and select a model (defaults to `gpt-4o`).
2. **Initiate Inquiry**:
   1. **Dialogue Box**: Type your question.
   2. **Quick Buttons**: Click "Quick Question" buttons, such as "Which operator filters missing values?" to start instantly.
3. **View Results**:
   1. **Chat Area**: Displays the Agent's response and citations.
   2. **Right Panel**:
      * `Related Operators`: Lists operator names retrieved by the Agent.
      * `Code Snippets`: Displays Python source code if specific implementations are involved.

### 4.2 Script Invocation and Explicit Configuration

In addition to the UI interface, the system provides the `script/run_dfa_operator_qa.py` script. This method is suitable for development and debugging, or for querying operator usage through code automation.

#### 1. Modify the Configuration

Open `script/run_dfa_operator_qa.py` and make modifications in the configuration section at the top of the file.

**API and File Configuration**

* **CHAT_API_URL**: URL of the LLM service.
* **API_KEY**: Model invocation key. The Agent needs to call the large model to understand your questions and summarize the answers.
* **MODEL**: Model name, the default is `gpt-4o`.
* **CACHE_DIR**: Cache directory.
* **TOP_K**: Retrieval depth. Specify the maximum number of candidate results the Agent returns when retrieving relevant operators from the knowledge base (5 by default).

**Query and Interaction Mode Configuration**

* **INTERACTIVE**: **Interaction control switch** (`True` / `False`).
  * `True` (Interactive Mode): Launch the continuous conversation mode in the terminal. You can ask follow-up questions like chatting, and support `clear` to clear history.
  * `False` (One-time Mode): The script only executes one question specified by `QUERY` and exits immediately after outputting the result.
* **QUERY**: Question content for one-time query. Only effective when `INTERACTIVE = False`.
* **OUTPUT_JSON**: Result save path.
  * Only effective in one-time mode.
  * If a path is set, the Agent's answer, the retrieved list of operators and code snippets will be completely saved as a JSON file; if left blank, it will only be printed to the console.

#### 2. Run the Script

After completing the configuration, execute the following command in the terminal:

```bash
python script/run_dfa_operator_qa.py

```

#### 3. Result Output

After the script is executed, the console behaves differently depending on the mode:

* **Interactive Mode**: The `🧑 You:` prompt appears in the terminal, waiting for input.
  * Enter `exit` or `quit` to exit.
  * Enter `clear` to clear conversation history.
  * Enter `history` to view conversation history.
* **One-time Mode**: The console directly prints the Agent's thinking process, the retrieved list of operators and the final answer. If `OUTPUT_JSON` is configured, a prompt of successful file saving will also be displayed.

### 4.3 Practical Case: Find Operators for "Data Cleaning"

You can refer to the following tutorials for learning, and also use the sample of [Google Colab](https://colab.research.google.com/drive/1maDKWp-3zEQNScmL_S7MHUdUC1xyCIcK?usp=sharing) we provide to run the program:

Suppose you need to clean data when developing a Pipeline and want to know if there are ready-made operators in the DataFlow library for processing.

**Scenario Configuration**: We set it to one-time query mode and specify to save the results locally for viewing detailed parameters in the code later.

Open the script and modify the configuration as follows:

```python
# ===== Example config (edit here) =====

# 1. Disable interactive mode and execute a one-time query
INTERACTIVE = False 

# 2. Define your specific requirements
QUERY = "I want to clean data, which operator should I use?"

# 3. Ensure the API configuration is correct
CHAT_API_URL = os.getenv("DF_API_URL", "http://123.129.219.111:3000/v1/")
API_KEY = os.getenv("DF_API_KEY", "")
MODEL = os.getenv("DF_MODEL", "gpt-4o")

# 4. Specify the result save path 
OUTPUT_JSON = "cache_local/operator_qa_result.json"


```

**Run**:

After running the script, the Agent will perform RAG retrieval and generate an answer. Open the generated `script/cache_local/operator_qa_result.json` and you can see the data with the following structure:

```json
{
  "success": true,
  "query": "I want to clean data, which operator should I use?",
  "answer": "在 DataFlow 中，有多个算子可以用于数据清洗。以下是一些推荐的算子：\n\n1. **KBCTextCleaner**: 适用于对原始知识内容进行标准化处理，包括HTML标签清理、特殊字符规范化、链接处理和结构优化。适合需要提升RAG知识库质量的场景。\n\n2. **KBCTextCleanerBatch**: 类似于 KBCTextCleaner，但支持批量处理。\n\n3. **ContentNullFilter**: 用于过滤空值、空字符串或仅包含空白字符的文本，确保输入数据的有效性。\n\n4. **HtmlUrlRemoverRefiner**: 去除文本中的URL链接和HTML标签，净化文本内容。\n\n5. **PresidioFilter**: 基于PresidioScorer打分器的得分对数据进行过滤，识别并处理文本中的私人实体(PII)。",
  "related_operators": [
    "KBCTextCleaner",
    "KBCTextCleanerBatch",
    "ContentNullFilter",
    "HtmlUrlRemoverRefiner",
    "PresidioFilter"
  ],
  "code_snippet": null,
  "follow_up_suggestions": [
    "了解如何配置这些算子的参数",
    "查看某个算子的详细实现",
    "询问特定数据清洗场景的最佳实践"
  ],
  "messages": [
    {
      "type": "SystemMessage",
      "content": "\n[角色]\n你是 DataFlow 算子库的智能问答助手。你的职责是帮助用户了解和使用 DataFlow 中的各种数据处理算子。\n\n[能力]\n1. 根据用户描述的需求，推荐合适的算子\n2. 解释算子的功能、用途和使用场景\n3. 详细说明算子的参数含义和配置方法\n4. 在需要时展示算子的源码实现\n5. 基于多轮对话理解用户的上下文需求\n\n[DataFlow 算子简介]\nDataFlow 是一个数据处理框架，提供了丰富的算子用于数据清洗、过滤、生成、评估等任务。\n每个算子都是一个 Python 类，通常包含：\n- `__init__` 方法：初始化算子，配置必要的参数（如 LLM 服务、提示词等）\n- `run` 方法：执行数据处理逻辑，接收输入数据并产出处理结果\n\n[可用工具]\n你可以调用以下工具来获取算子信息：\n\n1. **search_operators(query, top_k)** - 根据功能描述搜索相关算子\n   - 当用户询问某类功能的算子时使用\n   - 如果对话历史中已有相关算子信息，可以不调用直接回答\n\n2. **get_operator_info(operator_name)** - 获取指定算子的详细描述\n   - 当用户询问特定算子的功能时使用\n\n3. **get_operator_source_code(operator_name)** - 获取算子的完整源代码\n   - 当用户需要了解算子实现细节时使用\n\n4. **get_operator_parameters(operator_name)** - 获取算子的参数详情\n   - 当用户询问算子如何配置、参数含义时使用\n\n[工具调用策略]\n- 如果是新问题且对话历史中没有相关信息 → 调用 search_operators 检索\n- 如果对话历史中已有相关算子信息 → 可以直接回答，无需重复检索\n- 如果用户追问某个算子的细节 → 调用 get_operator_info/get_operator_source_code/get_operator_parameters\n\n[回答风格]\n1. 清晰简洁，重点突出\n2. 使用中文回答（除非用户要求英文）\n3. 对于技术细节，提供具体的代码示例\n4. 在解释参数时，说明参数类型、默认值和作用\n\n[输出格式]\n请以 JSON 格式返回，包含以下字段：\n{\n    \"answer\": \"对用户问题的详细回答\",\n    \"related_operators\": [\"相关算子名称列表\"],\n    \"source_explanation\": \"说明答案的信息来源，例如：'通过search_operators检索到的XXX算子'、'基于对话历史中的算子信息'、'基于我的知识库'\",\n    \"code_snippet\": \"如有必要，提供代码片段（可选）\",\n    \"follow_up_suggestions\": [\"可能的后续问题建议（可选）\"]\n}\n\n\n请以JSON格式返回结果，不要包含其他文字说明!!!直接返回json内容，不要```json进行包裹！！",
      "role": "",
      "additional_kwargs": {},
      "metadata": {}
    },
    {
      "type": "HumanMessage",
      "content": "\n[用户问题]\nI want to clean data, which operator should I use?\n\n[任务]\n请根据用户问题回答。对话历史会自动包含在消息中，你可以参考之前的对话。\n\n工具调用指南：\n1. 如果需要查找算子，调用 search_operators 工具\n2. 如果需要某个算子的详细信息，调用 get_operator_info 工具\n3. 如果需要源码，调用 get_operator_source_code 工具\n4. 如果需要参数详情，调用 get_operator_parameters 工具\n5. 如果之前的对话中已有相关信息，可以直接回答，无需重复调用工具\n\n回答要求：\n- 基于工具返回的信息或对话上下文中的信息回答\n- 在 source_explanation 中说明答案来源\n- 如果问题不明确，可以在 follow_up_suggestions 中给出澄清建议\n\n请以 JSON 格式返回你的回答。\n",
      "role": "",
      "additional_kwargs": {},
      "metadata": {}
    },
    {
      "type": "AIMessage",
      "content": "",
      "role": "",
      "additional_kwargs": {
        "tool_calls": [
          {
            "id": "call_06xfRcedme8OAVBq33keXVdS",
            "function": {
              "arguments": "{\"query\":\"clean data\"}",
              "name": "search_operators"
            },
            "type": "function"
          }
        ],
        "refusal": null
      },
      "metadata": {}
    },
    {
      "content": "{\n  \"query\": \"clean data\",\n  \"matched_operators\": [\n    \"KBCTextCleaner\",\n    \"KBCTextCleanerBatch\",\n    \"ContentNullFilter\",\n    \"HtmlUrlRemoverRefiner\",\n    \"PresidioFilter\"\n  ],\n  \"operator_details\": [\n    {\n      \"node\": 1,\n      \"name\": \"KBCTextCleaner\",\n      \"description\": \"知识清洗算子：对原始知识内容进行标准化处理，包括HTML标签清理、特殊字符规范化、链接处理和结构优化，提升RAG知识库的质量。主要功能：\\n1. 移除冗余HTML标签但保留语义化标签\\n2. 标准化引号/破折号等特殊字符\\n3. 处理超链接同时保留文本\\n4. 保持原始段落结构和代码缩进\\n5. 确保事实性内容零修改\\n\\n输入格式示例：\\n<div class=\\\"container\\\">\\n  <h1>标题文本</h1>\\n  <p>正文段落，包括特殊符号，例如“弯引号”、–破折号等</p>\\n  <img src=\\\"example.jpg\\\" alt=\\\"示意图\\\">\\n  <a href=\\\"...\\\">链接文本</a>\\n  <pre><code>代码片段</code></pre>\\n  ...\\n</div>\\n\\n输出格式示例：\\n标题文本\\n\\n正文段落，包括特殊符号，例如\\\"直引号\\\"、-破折号等\\n\\n[Image: 示例图 example.jpg]\\n\\n链接文本\\n\\n<code>代码片段</code>\\n\\n[结构保持，语义保留，敏感信息脱敏处理（如手机号、保密标记等）]\",\n      \"category\": \"knowledge_cleaning\"\n    },\n    {\n      \"node\": 2,\n      \"name\": \"KBCTextCleanerBatch\",\n      \"description\": \"知识清洗算子：对原始知识内容进行标准化处理，包括HTML标签清理、特殊字符规范化、链接处理和结构优化，提升RAG知识库的质量。主要功能：\\n1. 移除冗余HTML标签但保留语义化标签\\n2. 标准化引号/破折号等特殊字符\\n3. 处理超链接同时保留文本\\n4. 保持原始段落结构和代码缩进\\n5. 确保事实性内容零修改\",\n      \"category\": \"knowledge_cleaning\"\n    },\n    {\n      \"node\": 3,\n      \"name\": \"ContentNullFilter\",\n      \"description\": \"该算子用于过滤空值、空字符串或仅包含空白字符的文本，确保输入数据的有效性。\\n初始化参数：\\n- 无\\n运行参数：\\n- storage：DataFlowStorage对象\\n- input_key：输入文本字段名\\n- output_key：输出标签字段名，默认为'content_null_filter_label'\\n返回值：\\n- 包含output_key的列表\",\n      \"category\": \"general_text\"\n    },\n    {\n      \"node\": 4,\n      \"name\": \"HtmlUrlRemoverRefiner\",\n      \"description\": \"去除文本中的URL链接和HTML标签，净化文本内容。使用正则表达式匹配并移除各种形式的URL和HTML标签。输入参数：\\n- input_key：输入文本字段名\\n输出参数：\\n- 包含净化后文本的DataFrame\\n- 返回输入字段名，用于后续算子引用\",\n      \"category\": \"general_text\"\n    },\n    {\n      \"node\": 5,\n      \"name\": \"PresidioFilter\",\n      \"description\": \"基于PresidioScorer打分器的得分对数据进行过滤。使用Microsoft Presidio模型识别文本中的私人实体(PII)，返回PII信息个数。\\n支持识别姓名、邮箱、电话号码、身份证号等多种敏感信息类型，可用于数据隐私保护和合规性检查。\\n输入参数：\\n- min_score：保留样本的最小PII数量阈值，默认为0\\n- max_score：保留样本的最大PII数量阈值，默认为5\\n- lang：文本语言，默认为'en'\\n- device：模型运行设备，默认为'cuda'\\n- model_cache_dir：模型缓存目录，默认为'./dataflow_cache'\\n输出参数：\\n- 过滤后的DataFrame，仅保留PII数量在[min_score, max_score]范围内的样本\\n- 返回包含输出字段名的列表，用于后续算子引用\",\n      \"category\": \"general_text\"\n    }\n  ]\n}",
      "additional_kwargs": {},
      "response_metadata": {},
      "type": "tool",
      "name": "search_operators",
      "id": "72462389-4f54-4b33-9c31-0f662cc537cb",
      "tool_call_id": "call_06xfRcedme8OAVBq33keXVdS",
      "artifact": null,
      "status": "success"
    },
    {
      "type": "AIMessage",
      "content": "{\n    \"answer\": \"在 DataFlow 中，有多个算子可以用于数据清洗。以下是一些推荐的算子：\\n\\n1. **KBCTextCleaner**: 适用于对原始知识内容进行标准化处理，包括HTML标签清理、特殊字符规范化、链接处理和结构优化。适合需要提升RAG知识库质量的场景。\\n\\n2. **KBCTextCleanerBatch**: 类似于 KBCTextCleaner，但支持批量处理。\\n\\n3. **ContentNullFilter**: 用于过滤空值、空字符串或仅包含空白字符的文本，确保输入数据的有效性。\\n\\n4. **HtmlUrlRemoverRefiner**: 去除文本中的URL链接和HTML标签，净化文本内容。\\n\\n5. **PresidioFilter**: 基于PresidioScorer打分器的得分对数据进行过滤，识别并处理文本中的私人实体(PII)。\",\n    \"related_operators\": [\n        \"KBCTextCleaner\",\n        \"KBCTextCleanerBatch\",\n        \"ContentNullFilter\",\n        \"HtmlUrlRemoverRefiner\",\n        \"PresidioFilter\"\n    ],\n    \"source_explanation\": \"通过search_operators检索到的相关算子\",\n    \"code_snippet\": null,\n    \"follow_up_suggestions\": [\n        \"了解如何配置这些算子的参数\",\n        \"查看某个算子的详细实现\",\n        \"询问特定数据清洗场景的最佳实践\"\n    ]\n}",
      "role": "",
      "additional_kwargs": {
        "refusal": null
      },
      "metadata": {}
    }
  ]
}

```