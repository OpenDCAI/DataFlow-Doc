---
title: Function Call Data Synthesis Operators
createTime: 2025/07/20 21:50:53
permalink: /en/guide/qdq6vy95/
---

# Function Call Data Synthesis Operators

## Overview

Function call data synthesis operators are designed to synthesize structured function call data from dialogues or real-world task descriptions. These operators cover scenario extraction and expansion, task generation and validation, function generation, and multi-agent multi-turn conversation generation.

All related operators are located in [dataflow/operators/conversations/](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/conversations/). The table below summarizes their applicable scenarios:

<table class="tg">
  <thead>
    <tr>
      <th class="tg-0pky">Name</th>
      <th class="tg-0pky">Type</th>
      <th class="tg-0pky">Description</th>
      <th class="tg-0pky">Repo or Paper</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="tg-0pky">ScenarioExtractor</td>
      <td class="tg-0pky">Scenario Extraction</td>
      <td class="tg-0pky">Extracts scenario descriptions from conversations using LLM.</td>
      <td class="tg-0pky" rowspan="8">
        <a href="https://github.com/PKU-Baichuan-MLSystemLab/BUTTON">Data</a><br>
        <a href="https://arxiv.org/abs/2410.12952">Paper</a><br>
      </td>
    </tr>
    <tr>
      <td class="tg-0pky">ScenarioExpander</td>
      <td class="tg-0pky">Scenario Expansion</td>
      <td class="tg-0pky">Generates alternative scenarios based on original ones using LLM.</td>
    </tr>
    <tr>
      <td class="tg-0pky">AtomTaskGenerator</td>
      <td class="tg-0pky">Task Generation</td>
      <td class="tg-0pky">Generates atomic tasks from scenario descriptions using LLM.</td>
    </tr>
    <tr>
      <td class="tg-0pky">SequentialTaskGenerator</td>
      <td class="tg-0pky">Task Generation</td>
      <td class="tg-0pky">Generates subsequent tasks and composes them into sequential tasks.</td>
    </tr>
    <tr>
      <td class="tg-0pky">ParaSeqTaskGenerator</td>
      <td class="tg-0pky">Task Generation</td>
      <td class="tg-0pky">Generates parallel and subsequent tasks and combines them with the original task.</td>
    </tr>
    <tr>
      <td class="tg-0pky">CompositionTaskFilter</td>
      <td class="tg-0pky">Task Filtering</td>
      <td class="tg-0pky">Validates compositional tasks and filters out incomplete ones using LLM.</td>
    </tr>
    <tr>
      <td class="tg-0pky">FunctionGenerator</td>
      <td class="tg-0pky">Function Generation</td>
      <td class="tg-0pky">Generates function definitions for a given task composition and its subtasks.</td>
    </tr>
    <tr>
      <td class="tg-0pky">MultiTurnConversationGenerator</td>
      <td class="tg-0pky">Dialogue Generation</td>
      <td class="tg-0pky">Generates multi-turn conversations with User, Assistant, and Tool agents based on tasks and functions.</td>
    </tr>
  </tbody>
</table>

## Operator Details

### 1. ScenarioExtractor ✨

**Description:**  
Extracts concise task scenario descriptions from dialogue using an LLM.

**Parameters:**

- `__init__()`
  - `llm_serving`: LLM interface instance
- `run()`
  - `storage`: data storage interface
  - `input_chat_key`: field name for conversation input
  - `output_key`: output field name (default: `"scenario"`)

**Highlights:**

- Strong contextual understanding  
- Forms basis for downstream task generation  
- Supports batch processing

---

### 2. ScenarioExpander ✨

**Description:**  
Expands extracted task scenarios to generate varied alternatives via LLM.

**Parameters:**

- `__init__()`
  - `llm_serving`: LLM interface instance
- `run()`
  - `storage`: data storage interface
  - `input_scenario_key`: field name of original scenario
  - `output_key`: output field name (default: `"modified_scenario"`)

**Highlights:**

- Enhances scenario diversity  
- Useful for data augmentation

---

### 3. AtomTaskGenerator ✨

**Description:**  
Generates fine-grained atomic tasks from a given scenario.

**Parameters:**

- `__init__()`
  - `llm_serving`: LLM interface instance
- `run()`
  - `storage`: data storage interface
  - `input_scenario_key`: field name for scenario input
  - `output_key`: output field name (default: `"atom_task"`)

**Highlights:**

- Atomic-level task granularity  
- Task decomposition from scenario

---

### 4. SequentialTaskGenerator ✨

**Description:**  
Creates follow-up tasks and combines them with atomic tasks into a sequential flow.

**Parameters:**

- `__init__()`
  - `llm_serving`: LLM interface instance
- `run()`
  - `storage`: data storage interface
  - `input_task_key`: field name for atomic task
  - `output_subsequent_task_key`: subsequent task field (default: `"subsequent_task"`)
  - `output_composition_task_key`: composed task field (default: `"composition_task"`)

**Highlights:**

- Supports multi-step task flow generation  
- Clear structure and traceability

---

### 5. ParaSeqTaskGenerator ✨

**Description:**  
Generates parallel and sequential extensions for an atomic task and composes them into a complex task.

**Parameters:**

- `__init__()`
  - `llm_serving`: LLM interface instance
- `run()`
  - `storage`: data storage interface
  - `input_task_key`: atomic task field
  - `output_parallel_task_key`: parallel task field (default: `"parallel_task"`)
  - `output_subsequent_task_key`: subsequent task field (default: `"subsequent_task"`)
  - `output_composition_task_key`: composed task field (default: `"composition_task"`)

**Highlights:**

- Multi-dimensional task modeling  
- Captures concurrency and sequencing

---

### 6. CompositionTaskFilter ✨

**Description:**  
Validates if a composed task is logically complete and executable. Filters invalid or incoherent compositions.

**Parameters:**

- `__init__()`
  - `llm_serving`: LLM interface instance
- `run()`
  - `storage`: data storage interface
  - `input_composition_task_key`: composed task field
  - `input_sub_tasks_keys`: list of subtask field names
  - `output_key`: label field for executability (default: `"runable_label"`)

**Highlights:**

- Logical and semantic validation  
- Filters for downstream function generation

---

### 7. FunctionGenerator ✨

**Description:**  
Generates structured function call specifications (name, parameters, doc) for a composed task and its subtasks.

**Parameters:**

- `__init__()`
  - `llm_serving`: LLM interface instance
- `run()`
  - `storage`: data storage interface
  - `input_composition_task_key`: composed task field
  - `input_sub_tasks_keys`: subtask field names
  - `output_key`: output field for functions (default: `"functions"`)

**Highlights:**

- LLM-based function synthesis  
- Designed for tool/agent integration  
- Structured JSON-like output

---

### 8. MultiTurnConversationGenerator ✨🚀

**Description:**  
Simulates multi-turn conversations involving User, Assistant, and Tool agents to complete the composed task via function calls.

**Parameters:**

- `__init__()`
  - `llm_serving`: LLM interface instance
- `run()`
  - `storage`: data storage interface
  - `input_task_key`: composed task field
  - `input_sub_tasks_keys`: list of subtask fields
  - `input_functions_key`: field name for function list
  - `output_conversations_key`: output field for conversations (default: `"conversations"`)

**Highlights:**

- Multi-agent interactive generation  
- Supports function call injection  
- Up to 5 full interaction rounds

---

For code examples, refer to the [Function Call Data Synthesis Pipeline](https://opendcai.github.io/DataFlow-Doc/en/guide/e6kz1s79/) or the [GitHub source file](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/conversations/).