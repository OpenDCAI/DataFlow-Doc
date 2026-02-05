---
title: 算子问答
createTime: 2026/02/05 22:11:00
permalink: /zh/guide/agent/operator_qa/
---

## 1. 概述 

**算子智能问答 (Operator QA)** 是 DataFlow-Agent 平台内置的垂直领域专家助手。它的核心使命是帮助用户快速在海量的 DataFlow 算子库中找到所需的工具，理解其用法，并查看底层源码。

不同于通用的聊天机器人，Operator QA 集成了 **RAG（检索增强生成）** 技术。它挂载了 DataFlow 项目的完整算子索引（FAISS）和元数据知识库。当用户提问时，Agent 会自主决定是否需要检索知识库，检索哪些算子，并将准确的技术细节（包括代码片段、参数说明）反馈给用户。

## 2. 核心特性 

该功能模块由前端 UI (operator_qa.py)、脚本入口 (run_dfa_operator_qa.py) 和后端智能体 (operator_qa_agent.py) 共同驱动，具备以下核心能力：

### 2.1 智能检索与推荐

Agent 并非简单地进行关键词匹配，而是基于语义理解用户的需求。

- **语义搜索**：用户只需描述“我想过滤掉缺失值”，Agent 会通过向量检索找到 `ContentNullFilter`等相关算子。
- **按需调用**：基于 `BaseAgent` 的图模式 (`use_agent=True`)，Agent 会根据对话上下文自动判断是否需要调用 `search_operators` 工具，或者直接基于上下文回答。

### 2.2 多轮对话 

利用 `AdvancedMessageHistory` 模块，系统维护了完整的会话上下文。

- **上下文记忆**：用户可以先问“有哪些加载数据的算子？”，接着问“**它**的参数怎么填？”。Agent 能识别“它”指的是上一轮推荐的算子。
- **状态保持**：在脚本交互模式或 UI 中，通过复用同一个 `state` 和 `graph` 实例，`messages` 列表会在多轮对话中累积，确保 LLM 拥有完整记忆。

### 2.3 可视化与交互 

- **Gradio UI**：提供代码预览、算子高亮和快捷提问按钮。
- **交互**：支持多轮问答，支持清除历史、查看历史等。

## 3. 架构组件

### 3.1 OperatorQAAgent

- 继承自 `BaseAgent`，配置为 ReAct/Graph 模式。
- 它拥有后置工具（Post-Tools）权限，可以调用 RAG 服务获取数据。
- 它负责解析用户的自然语言，规划是否查库，并生成最终的自然语言回复。

### 3.2 OperatorRAGService 

- 这是一个与 Agent 解耦的服务层。
- 管理 FAISS 向量索引和 `ops.json` 元数据。
- 提供 `search`（向量搜索）、`get_operator_info`（获取详情）、`get_operator_source`（获取源码）等底层能力。

## 4. 使用指南

### 4.1 界面操作

1. **配置模型**：在右侧“配置”面板确认 API URL 和 Key，并选择模型（默认使用 `gpt-4o`）。
2. **发起提问**：
   1. **对话框**：输入你的问题。
   2. **快捷按钮**：也可以点击下方的“快捷问题”按钮，如“过滤缺失值用什么算子？”快速开始。
3. **查看结果**：
   1. **对话区**：显示 Agent 的回答和引用来源。
   2. **右侧面板**：
      - `相关算子`：列出 Agent 检索到的算子名称。
      - `代码片段`：如果涉及具体实现，这里会显示 Python 源码。

### 4.2 脚本调用与显式配置 

除了 UI 界面，系统提供了 `run_dfa_operator_qa.py` 脚本，支持通过代码显式配置参数来运行问答服务。这种方式适合开发调试。

**配置方式：** 直接修改脚本顶部的常量配置区域，无需通过命令行参数传递：

```Python
# ===== Example config (edit here) =====
INTERACTIVE = False                  # True开启多轮交互模式，False为单次查询
QUERY = "我想过滤掉缺失值用哪个算子？" # 单次查询的问题

LANGUAGE = "zh"
SESSION_ID = "demo_operator_qa"
CACHE_DIR = "dataflow_cache"
TOP_K = 5                            # 检索结果数量

CHAT_API_URL = os.getenv("DF_API_URL", "http://123.129.219.111:3000/v1/")
API_KEY = os.getenv("DF_API_KEY", "")
MODEL = os.getenv("DF_MODEL", "gpt-4o")

OUTPUT_JSON = ""  # e.g. "cache_local/operator_qa_result.json"；空字符串表示不落盘
```

**运行模式：**

1. **单次查询模式** (`INTERACTIVE = False`): 执行单次 `QUERY`，结果可直接打印或保存为 JSON 文件。
2. **交互模式** (`INTERACTIVE = True`): 启动终端对话循环，支持 `exit` 退出、`clear` 清除上下文、`history` 查看历史。

**核心代码逻辑：** 脚本演示了如何显式构造 `DFRequest` 和 `MainState`，并手动构建执行图：

```Python
# 1. 显式构造请求
req = DFRequest(
    language=LANGUAGE,
    chat_api_url=CHAT_API_URL,
    api_key=API_KEY,
    model=MODEL,
    target="" # 每次查询前再写入
)

# 2. 初始化状态与图
state = MainState(request=req, messages=[])
graph = create_operator_qa_graph().build()

# 3. 执行
result = await run_single_query(state, graph, QUERY)
```