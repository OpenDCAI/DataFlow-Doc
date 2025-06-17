---
title: DataFlow-Agent Data Preparation
icon: material-symbols:robot-2-outline
createTime: 2025/06/17 15:56:00
permalink: /en/guide/agent/agent_for_data/
---

### 1. **Planning Phase (Planning Agent)**

- **Task Decomposition**: 
  - Parse task objectives based on user input (such as natural language requirements, data characteristics, goals, etc.).
  - Decompose complex tasks into fine-grained subtasks to form a clear subtask list.
- **Define Task Chain**: 
  - Organize subtasks into a task chain (pipeline) according to their dependencies.
  - If user requirements are clear, directly generate a standard task chain that meets the needs; otherwise, generate one through task reasoning.

### 2. **Tool Registration Phase (Tool Register)**

- **Register Predefined Tools**: 
  - Predefined tool library: includes operators for data sampling, cleaning, evaluation, generation, etc.
  - Dynamic tool generation: automatically register new tools by package scanning and operator description extraction (e.g., via `get_desc`).
  - Tool description vectorization: generate semantic representations of tools by combining functional descriptions, input/output types, sample data, etc., for subsequent retrieval and recommendation.

### 3. **Task Dispatch Phase (Task Dispatcher)**

- **Assign Tasks to Agent**: 
  - Distribute tasks to the corresponding agent sequentially or in parallel according to the task chain.
  - Provide context tracking for the task chain (e.g., using `sessionKEY` for multi-turn dialogue tracking).

### 4. **Task Execution Phase (Execution Agent)**

- **Generate Tools**: 
  - Dynamically write the required code for tasks (such as Python scripts) and debug the code.
  - During execution, automatically obtain task parameters (such as user input or the output of the previous task) and fill them into the code.
  - When parameters or context are missing, the Execution Agent will prompt the user for completion.
- **Process Tasks**: 
  - Execute node operations within the task chain, including invoking predefined tools or dynamically generated tools.
  - Pass execution results in real-time to subsequent task nodes or return them to the user for review.

### 5. **Result Evaluation Phase (Evaluation Agent)**

- **Debug and Validate**: 
  - Perform syntax, logic, and data integrity checks on task execution results.
  - For code-based tasks, check whether the code execution results meet expectations (e.g., returning results in JSON format).

### 6. **Analysis and Summary Phase (Analysis Agent)**

- **Summarize and Generate Report**: 
  - Analyze the task execution process and results, generating highly readable reports.
  - Generate contextual summaries for multi-turn dialogues, helping users quickly review the overall execution of the task chain.
