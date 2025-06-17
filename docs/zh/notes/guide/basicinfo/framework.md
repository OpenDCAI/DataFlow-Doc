---
title: 框架设计
icon: material-symbols:auto-transmission-sharp
createTime: 2025/06/13 14:59:56
permalink: /zh/guide/framework/
---
![Dataflow-Framework](/dataflow_framework.jpg)
# 框架设计
Dataflow的框架主要分为算子层和Pipeline层。

为了使用AI辅助数据处理，我们额外添加了Agent for Dataflow模块。Agent可以(1)自动编排算子 (2)自动编写数据算子 (3)Agent自动解决数据分析任务。

## DataFlow 算子

DataFlow 算子是对原始数据执行的基本处理单元，通常基于规则系统、深度学习模型或大语言模型（LLM）实现。如上图中的 Reasoning Pipeline 所示，每一个模块均可视为一个独立的 DataFlow 算子，用于完成特定的数据加工任务（如清洗、转换、验证等）。

## DataFlow Pipeline

DataFlow Pipeline 是对多个 DataFlow 算子的有序编排，旨在完成一个完整的数据处理或分析任务。通过将数据生成、清洗、验证等多个步骤进行串联或并联组合，形成如上图所示的 Reasoning Pipeline，用于实现从原始数据到结构化结果的全流程自动化处理。

![Reasoning-Pipeline](/Reasoning_Pipeline.jpg)

## DataFlow Agent

DataFlow Agent 是一个基于多智能体协同的自动化任务处理系统，覆盖 **任务拆解 → 工具注册 → 调度执行 → 结果验证 → 报告生成** 的完整流程，致力于复杂任务的智能化管理与执行。其核心模块包括：

- **Planning Agent**：理解用户意图，并将高层需求拆解为具体可执行任务链；
- **Tool Register**：动态管理已有和新生成的工具（如算子、模型或脚本）；
- **Task Dispatcher**：将任务指派给 Execution Agent，支持代码自动生成与调试；
- **Execution Agent**：执行具体任务，进行数据处理、模型调用等；
- **Evaluation Agent**：对执行结果进行质量与正确性评估；
- **Analysis Agent**：对流程和结果进行总结，生成结构化报告。

系统支持短期与长期记忆机制，能够维持多轮交互状态，在保证标准化流程的同时，具备高度的动态适应能力，尤其适用于数据治理、自动化数据分析等需要多阶段协同的复杂场景。

![Dataflow-Agent](/agent.png)
