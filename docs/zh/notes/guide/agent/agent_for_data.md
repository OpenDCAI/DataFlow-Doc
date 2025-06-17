---
title: Agent数据治理
icon: material-symbols:robot-2-outline
createTime: 2025/06/17 15:56:00
permalink: /zh/guide/agent/agent_for_data/
---

### 1. **任务规划阶段（Planning Agent）**

- **任务分解（Decompose Tasks）**：
  - 根据用户的输入（如自然语言需求、数据特性、目标等），解析任务目标。
  - 对复杂任务进行细粒度分解，形成清晰的子任务列表。
- **定义任务链（Define Task Chain）**：
  - 将子任务按依赖关系组织成任务链（Pipeline）。
  - 如果用户需求明确，可以直接生成符合需求的标准任务链；否则，通过任务推理生成。

### 2. **工具注册阶段（Tool Register）**

- **注册工具（Register Predefined Tools）**： 
  - 预定义工具库：包括数据抽样、清洗、评估、生成等算子。
  - 动态工具生成：通过包扫描和算子描述提取（如 `get_desc`），自动注册新的工具。
  - 工具描述向量化：结合功能描述、输入输出类型、示例数据等信息，生成工具的语义表示，用于后续检索和推荐。

### 3. **任务调度阶段（Task Dispatcher）**

- **分配任务（Assign Tasks to Agent）**： 
  - 根据任务链，按顺序或并行分发任务给对应的 Agent。
  - 提供任务链的上下文跟踪（如 `sessionKEY` 用于多轮对话追踪）。

### 4. **任务执行阶段（Execution Agent）**

- **生成工具（Generate Tools）**：
  - 动态编写任务所需代码（如 Python 脚本），并对代码进行调试。
  - 执行过程中，自动获取任务参数（如用户输入或上一个任务的输出）并填充到代码中。
  - 当缺少参数或上下文时，Execution Agent 会调用用户提示补全。
- **处理任务（Process Tasks）**：
  - 执行任务链中的节点操作，包括预定义工具调用或动态生成工具的执行。
  - 将执行结果实时传递给后续任务节点，或返回给用户查看。

### 5. **结果评估阶段（Evaluation Agent）**

- **调试与验证（Debug and Validate）**： 
  - 对任务执行结果进行语法、逻辑和数据完整性校验。
  - 针对代码型任务，检查代码运行结果是否符合预期（如返回符合 JSON 格式的结果）。

### 6. **分析与总结阶段（Analysis Agent）**

- **总结与报告生成（Summarize and Generate Report）**： 

  - 分析任务执行过程和结果，生成可读性强的报告。
  - 生成多轮对话的上下文总结，支持用户快速查看任务链的整体执行情况。

  