---
title: Framework Design  
icon: material-symbols:auto-transmission-sharp
createTime: 2025/06/13 14:59:56  
permalink: /en/guide/framework/  
---  
# Framework Design  

![Dataflow-Framework](/dataflow_framework.jpg)

# Framework Design

The architecture of DataFlow is primarily divided into two layers: the **Operator Layer** and the **Pipeline Layer**.

To enable AI-assisted data processing, we introduce an additional module—**Agent for DataFlow**. The Agent is capable of:  
(1) automatically orchestrating operators,  
(2) generating custom data operators, and  
(3) solving data analysis tasks autonomously.

![Reasoning-Pipeline](/Reasoning_Pipeline.jpg)

## DataFlow Operators

DataFlow Operators are the fundamental processing units applied to raw data. They are typically implemented using rule-based systems, deep learning models, or large language models (LLMs). As shown in the Reasoning Pipeline figure above, each module can be regarded as an independent DataFlow Operator, responsible for specific data manipulation tasks such as cleaning, transformation, and validation.

## DataFlow Pipelines

A DataFlow Pipeline is an ordered composition of multiple DataFlow Operators designed to complete an end-to-end data processing or analysis task. By chaining or paralleling various stages—including data generation, cleaning, and validation—the system forms a complete processing flow, as illustrated in the Reasoning Pipeline above. This enables full automation from raw data to structured outputs.

![Dataflow-Agent](/agent_en.png)

## DataFlow Agent

The **DataFlow Agent** is a multi-agent-based automated task processing system that covers the full lifecycle of **task decomposition → tool registration → task dispatch → execution → result verification → report generation**. It is designed for intelligent management and execution of complex workflows. The core components include:

- **Planning Agent**: Interprets user intent and decomposes high-level goals into executable task chains.
- **Tool Register**: Dynamically manages existing tools and newly generated components (e.g., operators, models, or scripts).
- **Task Dispatcher**: Assigns tasks to the Execution Agent and supports automatic code generation and debugging.
- **Execution Agent**: Carries out specific tasks, including data processing and model invocation.
- **Evaluation Agent**: Assesses the quality and correctness of the execution results.
- **Analysis Agent**: Summarizes the process and results, producing a structured final report.

The system supports both short-term and long-term memory mechanisms, enabling multi-turn interaction while maintaining standardized procedures. It is highly adaptable and particularly well-suited for complex scenarios requiring multi-stage coordination, such as data governance and automated data analysis.
