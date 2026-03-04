---
title: 函数调用数据合成算子
createTime: 2025/07/20 21:09:11
permalink: /zh/guide/kgdzd34m/
---

# 函数调用数据合成算子

## 概述

函数调用数据合成算子是专门用于从对话或现实场景合成函数调用数据的算子集合，这些算子主要包括了真实任务场景的提取和生成，任务的生成与验证，函数生成，多智能体多轮对话生成等功能。这些算子位于[dataflow/operators/conversations](https://github.com/OpenDCAI/DataFlow/tree/main/dataflow/operators/conversations)文件夹中，其适用场景可以参考下面的表格：

<table class="tg">
  <thead>
    <tr>
      <th class="tg-0pky">名称</th>
      <th class="tg-0pky">适用类型</th>
      <th class="tg-0pky">简介</th>
      <th class="tg-0pky">官方仓库或论文</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="tg-0pky">ScenarioExtractor</td>
      <td class="tg-0pky">场景提取</td>
      <td class="tg-0pky">从对话内容中提取场景信息，使用LLM服务分析对话并生成场景描述。</td>
      <td class="tg-0pky" rowspan="8">
        <a href="https://github.com/PKU-Baichuan-MLSystemLab/BUTTON">Data</a><br>
        <a href="https://arxiv.org/abs/2410.12952">Paper</a><br>
      </td>
    </tr>
    <tr>
      <td class="tg-0pky">ScenarioExpander</td>
      <td class="tg-0pky">场景扩展</td>
      <td class="tg-0pky">基于原始场景生成新的替代场景，使用LLM服务重写或改写原有场景内容。</td>
    </tr>
    <tr>
      <td class="tg-0pky">AtomTaskGenerator</td>
      <td class="tg-0pky">任务生成</td>
      <td class="tg-0pky">根据输入的场景信息，使用LLM服务生成对应的原子任务。</td>
    </tr>
    <tr>
      <td class="tg-0pky">SequentialTaskGenerator</td>
      <td class="tg-0pky">任务生成</td>
      <td class="tg-0pky">根据输入的原子任务，使用LLM服务生成该任务的后继任务和两者的组合任务。</td>
    </tr>
    <tr>
      <td class="tg-0pky">ParaSeqTaskGenerator</td>
      <td class="tg-0pky">任务生成</td>
      <td class="tg-0pky">基于原子任务，使用LLM服务生成三个任务类型：并行任务、后继任务以及这三者的组合任务。</td>
    </tr>
    <tr>
      <td class="tg-0pky">CompositionTaskFilter</td>
      <td class="tg-0pky">任务过滤</td>
      <td class="tg-0pky">根据组合任务及其子任务，使用LLM服务判断组合任务是否具备可行性与完备性，从而进行可运行任务的筛选。</td>
    </tr>
    <tr>
      <td class="tg-0pky">FunctionGenerator</td>
      <td class="tg-0pky">函数生成</td>
      <td class="tg-0pky">基于组合任务及其相关子任务，使用LLM服务生成对应的函数列表，</td>
    </tr>
    <tr>
      <td class="tg-0pky">MultiTurnConversationGenerator</td>
      <td class="tg-0pky">多轮对话生成</td>
      <td class="tg-0pky">根据组合任务及其子任务函数，使用LLM服务模拟多轮对话过程，由User、Assistant和Tool三个Agent协同生成完整的对话数据。</td>
    </tr>
  </tbody>
</table>

## 详细算子说明

### 1. ScenarioExtractor 

**功能描述：**  
从对话内容中提取任务场景信息，借助大语言模型分析对话背景，生成简洁准确的场景描述。

**输入参数：**

- `__init__()`
  - `llm_serving`：LLM服务接口对象
- `run()`
  - `storage`：数据存储对象
  - `input_chat_key`：对话内容字段名
  - `output_key`：场景输出字段名（默认："scenario"）

**主要特性：**

- 对话理解与摘要能力强  
- 场景可作为下游任务生成基础  
- 可批量处理多轮对话数据

---

### 2. ScenarioExpander 

**功能描述：**  
对提取出的任务场景进行扩展，生成新的、风格或内容有所差异的任务背景，以丰富数据集多样性。

**输入参数：**

- `__init__()`
  - `llm_serving`：LLM服务接口对象
- `run()`
  - `storage`：数据存储对象
  - `input_scenario_key`：原始场景字段名
  - `output_key`：扩展场景字段名（默认："modified_scenario"）

**主要特性：**

- 任务背景多样性增强  

---

### 3. AtomTaskGenerator 

**功能描述：**  
根据场景信息生成原子任务，每个任务是可独立执行的最小功能单元，供后续任务串联与合成使用。

**输入参数：**

- `__init__()`
  - `llm_serving`：LLM服务接口对象
- `run()`
  - `storage`：数据存储对象
  - `input_scenario_key`：场景字段名
  - `output_key`：原子任务字段名（默认："atom_task"）

**主要特性：**

- 精细粒度，原子化任务生成  

---

### 4. SequentialTaskGenerator 

**功能描述：**  
为每个原子任务生成其后继任务，并组合成顺序执行的复合任务，支持流程化任务设计。

**输入参数：**

- `__init__()`
  - `llm_serving`：LLM服务接口对象
- `run()`
  - `storage`：数据存储对象
  - `input_task_key`：原子任务字段名
  - `output_subsequent_task_key`：后继任务字段名（默认："subsequent_task"）
  - `output_composition_task_key`：组合任务字段名（默认："composition_task"）

**主要特性：**

- 支持任务链自动构造  
- 多任务依赖管理基础  
- 输出结构清晰、可追溯

---

### 5. ParaSeqTaskGenerator 

**功能描述：**  
在原子任务基础上生成对应的并行任务和后继任务，并将三者组合为复合任务，适用于复杂流程建模。

**输入参数：**

- `__init__()`
  - `llm_serving`：LLM服务接口对象
- `run()`
  - `storage`：数据存储对象
  - `input_task_key`：原子任务字段名
  - `output_parallel_task_key`：并行任务字段名（默认："parallel_task"）
  - `output_subsequent_task_key`：后继任务字段名（默认："subsequent_task"）
  - `output_composition_task_key`：组合任务字段名（默认："composition_task"）

**主要特性：**

- 三维任务结构自动生成  
- 支持并发与依赖协同  
- 更强任务组合表达力

---

### 6. CompositionTaskFilter 

**功能描述：**  
对组合任务及其子任务的结构合理性与可执行性进行评估，过滤掉不完整或不合理的任务组合。

**输入参数：**

- `__init__()`
  - `llm_serving`：LLM服务接口对象
- `run()`
  - `storage`：数据存储对象
  - `input_composition_task_key`：组合任务字段名
  - `input_sub_tasks_keys`：子任务字段名列表（如原子任务、后继任务）
  - `output_key`：可执行标识字段（默认："runable_label"）

**主要特性：**

- 精准识别无效任务组合  
- 输出可直接用于下游函数生成

---

### 7. FunctionGenerator 

**功能描述：**  
根据组合任务及其子任务结构，自动生成对应的函数列表，每个函数模拟实际系统中的调用模块。

**输入参数：**

- `__init__()`
  - `llm_serving`：LLM服务接口对象
- `run()`
  - `storage`：数据存储对象
  - `input_composition_task_key`：组合任务字段名
  - `input_sub_tasks_keys`：子任务字段名列表
  - `output_key`：函数输出字段名（默认："functions"）

**主要特性：**

- 面向工具调用场景设计  
- 支持函数名、参数与注释生成  
- 结构化输出易集成

---

### 8. MultiTurnConversationGenerator 

**功能描述：**  
利用组合任务与函数信息，在用户（User）、助手（Assistant）、工具（Tool）三方协作下，生成结构合理的多轮函数调用对话。

**输入参数：**

- `__init__()`
  - `llm_serving`：LLM服务接口对象
- `run()`
  - `storage`：数据存储对象
  - `input_task_key`：组合任务字段名
  - `input_sub_tasks_keys`：子任务字段名列表
  - `input_functions_key`：函数字段名
  - `output_conversations_key`：输出对话字段名（默认："conversations"）

**主要特性：**

- 多智能体对话模拟  
- 支持函数嵌入与调用结构  

算子的示例代码请参考文档[函数调用数据合成流水线](https://opendcai.github.io/DataFlow-Doc/zh/guide/hy4417i0/)或[GitHub仓库](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/conversations/)