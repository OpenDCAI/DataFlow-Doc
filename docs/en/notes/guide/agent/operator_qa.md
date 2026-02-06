---
title: Operator QA
createTime: 2026/02/05 22:11:00
permalink: /en/guide/agent/operator_qa/
---

## 1. Overview

**Operator QA** is a built-in vertical domain expert assistant within the DataFlow-Agent platform. Its core mission is to help users quickly navigate the extensive DataFlow operator library to find required tools, understand their usage, and inspect underlying source code.

Unlike generic chatbots, Operator QA integrates **RAG (Retrieval-Augmented Generation)** technology. It is equipped with a complete operator index (FAISS) and a metadata knowledge base of the DataFlow project. When a user asks a question, the Agent autonomously decides whether to retrieve information from the knowledge base, which operators to inspect, and provides accurate technical details—including code snippets and parameter descriptions—back to the user.

## 2. Core Features

This module is driven by a frontend UI (`operator_qa.py`), an entry script (`run_dfa_operator_qa.py`), and a backend agent (`operator_qa_agent.py`). It possesses the following core capabilities:

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

### 4.1 UI Operation

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

Beyond the UI, the system provides the `run_dfa_operator_qa.py` script, which supports running the Q&A service through explicit code configuration—ideal for development and debugging.

**Configuration Method:** Directly modify the constant configuration area at the top of the script without passing command-line arguments:

```python
# ===== Example config (edit here) =====
INTERACTIVE = False                  # True for multi-turn mode, False for single query
QUERY = "Which operator should I use to filter missing values?" # Question for single query

LANGUAGE = "en"
SESSION_ID = "demo_operator_qa"
CACHE_DIR = "dataflow_cache"
TOP_K = 5                            # Number of retrieval results

CHAT_API_URL = os.getenv("DF_API_URL", "http://123.129.219.111:3000/v1/")
API_KEY = os.getenv("DF_API_KEY", "")
MODEL = os.getenv("DF_MODEL", "gpt-4o")

OUTPUT_JSON = ""  # e.g., "cache_local/operator_qa_result.json"; empty string means no file saving

```

**Execution Modes:**

1. **Single Query Mode** (`INTERACTIVE = False`): Executes a single `QUERY`; results can be printed or saved as a JSON file.
2. **Interactive Mode** (`INTERACTIVE = True`): Starts a terminal dialogue loop supporting `exit` to quit, `clear` to reset context, and `history` to view session history.

**Core Logic:** The script demonstrates how to explicitly construct `DFRequest` and `MainState`, and manually build the execution graph:

```python
# 1. Explicitly construct the request
req = DFRequest(
    language=LANGUAGE,
    chat_api_url=CHAT_API_URL,
    api_key=API_KEY,
    model=MODEL,
    target="" # Populated before each query
)

# 2. Initialize state and graph
state = MainState(request=req, messages=[])
graph = create_operator_qa_graph().build()

# 3. Execute
result = await run_single_query(state, graph, QUERY)

```
