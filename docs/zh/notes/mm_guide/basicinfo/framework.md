---
title: 框架设计
icon: material-symbols:auto-transmission-sharp
createTime: 2025/06/13 14:59:56
permalink: /zh/mm_guide/basicinfo/framework/
---
![Dataflow-Framework](/dataflow_framework.jpg)
# 框架设计
Dataflow的框架主要数据处理逻辑分为算子层(`operator`)和流水线(`pipeline`)层。此外，还有数据管理`storage`和大模型后端`LLMServing`等模共同支持。

为了使用AI辅助数据处理，我们额外添加了`Agent for Dataflow`模块。Agent可以(1)自动编排算子 (2)自动编写数据算子 (3)Agent自动解决数据分析任务。


## 数据管理
DataFlow主要关注于大模型文本数据的处理，为了提高易用性，DataFlow内核通过`pandas`([https://github.com/pandas-dev/pandas](https://github.com/pandas-dev/pandas))的`DataFrame`来作为载体实现读写数据。因此，DataFlow支持常见的`json, jsonl, csv, parquet, pickle`等多种文本数据集格式作为输入和输出。并以对`DataFrame`表**增删查改**的方式来实现数据的清洗，扩增和评估。

实质上数据集管理的功能由`storage`类实现，源码位于[`https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/utils/storage.py`](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/utils/storage.py)。目前框架主要依赖**文件系统**作为数据读写与缓存的载体，未来会支持**数据库系统**的读写以支持超大量数据的处理。

## 大模型后端
大批量的数据，在复杂需求上的扩增，过滤，打分都需要借助大语言模型强大而灵活的语义理解能力。因此，DataFlow提供了`LLMServingABC`抽象类来统一管理在线/本地大模型。目前包括如下派生类：
- `LocalModelLLMServing`: 使用[vLLM](https://github.com/vllm-project/vllm)作为推理后端，在本地GPU部署大模型作为推理服务。
- `APILLMServing_request`: 使用`request`方式向网络上的大模型服务商的API（比如ChatGPT，Deepseek）发起请求，支持多进程并发请求。

## DataFlow 算子

![Reasoning-Pipeline](/Reasoning_Pipeline.png)

DataFlow 算子是对原始数据执行的基本处理单元，通常基于规则、深度学习模型或大语言模型（LLM）实现。以上图中的`Reasoning Pipeline`示意流程图为例，每一个矩形单元均可视为一个独立的 DataFlow 算子，用于完成特定的数据加工任务（如清洗、转换、验证等）。

DataFlow中每一个算子代码风格十分简洁，下方是一个`ReasoningQuestionDifficultySampleEvaluator`算子调用的例子，使用大模型后端来评估问题的难度等级：

```python
from dataflow.operators.generate.Reasoning import ReasoningQuestionDifficultySampleEvaluator,
question_difficulty_classifier = ReasoningQuestionDifficultySampleEvaluator(
    llm_serving=llm_serving             # 传入一个大模型LLMServing类作为后端
)
question_difficulty_classifier.run(
    storage = self.storage.step(),      # 存储类。管理，读写，缓存数据集
    input_key = "instruction",          # 读入数据的表字段名称
    output_key = "question_difficulty"  # 写出数据的字段名称
)
```

算子的设计参考了`PyTorch`的代码风格，易于理解。在`__init__`函数中初始化必要的设置，并在`run`函数中动态根据数据表的字段名用于读写，也会有部分参数在这里动态输入一些参数以便复用算子。DataFlow的代码规范只对算子要求这两个函数作为接口。

算子的`run`函数必须包含一个`storage`形参，用于读写数据。此外，关于表字段的约定如下：
- 如果算子只需读取/写出一个字段，则一般通过`input_key`和`output_key`来指定。
- 如果算子不需要写出字段，则完全没有`output_*`这样的形参。
- 如果需要读取/写出多个字段，则一般通过其功能指定形参名，比如`input_question_key`,`input_answer_key`，`output_question_quality_key`。

算子的`run`中的字段名可由用户灵活指定，以适应LLM数据集多变的字段命名方式（比如：`question`, `instruction`, `human`都会用来指代多轮对话中人类的问题）。此时设置为`input_key="question"`, `input_key="instruction"` 或 `input_key="human"`即可实现对于该类数据集的自由读取。

## DataFlow Pipeline

DataFlow Pipeline 是对多个 DataFlow 算子的有序编排，旨在完成一个完整的数据处理或分析任务。通过将数据生成、清洗、验证等多个步骤进行串联或并联组合，形成如上图所示的`Reasoning Pipeline`，用于实现从原始数据到结构化结果的全流程自动化处理。

DataFlow中的流水线一般以如下范式组织算子，整体代码风格仍然向`PyTorch`看齐：
```python
from dataflow.operators.generate.AgenticRAG import (
    AutoPromptGenerator,
    QAGenerator,
    QAScorer
)

from dataflow.operators.process.AgenticRAG import (
    ContentChooser
)

from dataflow.utils.storage import FileStorage
from dataflow.llmserving import APILLMServing_request, LocalModelLLMServing


class AgenticRAGPipeline():
    def __init__(self):

        self.storage = FileStorage(
            first_entry_file_name="../example_data/AgenticRAGPipeline/pipeline_small_chunk.json",
            cache_path="./cache_local",
            file_name_prefix="dataflow_cache_step",
            cache_type="json",
        )

        # use API server as LLM serving
        llm_serving = APILLMServing_request(
                api_url="https://api.openai.com/v1/chat/completions",
                model_name="gpt-4o",
                max_workers=1
        )

        self.content_chooser_step1 = ContentChooser(embedding_model_path="your embedding model path")

        self.prompt_generator_step2 = AutoPromptGenerator(llm_serving)

        self.qa_generator_step3 = QAGenerator(llm_serving)

        self.qa_scorer_step4 = QAScorer(llm_serving)
        
    def forward(self):

        self.content_chooser_step1.run(
            storage = self.storage.step(),
            input_key = "text",
            num_samples =5,
            method = "random"
        )

        self.prompt_generator_step2.run(
            storage = self.storage.step(),
            input_key = "text"
        )

        self.qa_generator_step3.run(
            storage = self.storage.step(),
            input_key="text",
            prompt_key="generated_prompt",
            output_quesion_key="generated_question",
            output_answer_key="generated_answer"
        )

        self.qa_scorer_step4.run(
            storage = self.storage.step(),
            input_question_key="generated_question",
            input_answer_key="generated_answer",
            output_question_quality_key="question_quality_grades",
            output_question_quality_feedback_key="question_quality_feedbacks",
            output_answer_alignment_key="answer_alignment_grades",
            output_answer_alignment_feedback_key="answer_alignment_feedbacks",
            output_answer_verifiability_key="answer_verifiability_grades",
        )
        
if __name__ == "__main__":
    model = AgenticRAGPipeline()
    model.forward()
```

目前DataFlow提供了多种预设`Pipeline`流水线用于完成预定功能。当你熟悉DataFlow框架后，也可以自由搭配现有算子，或设计你自己的新算子来构建适合你数据处理的`pipeline`。


## DataFlow Agent

DataFlow Agent 是一个基于多智能体协同的自动化任务处理系统，覆盖 **任务拆解 → 工具注册 → 调度执行 → 结果验证 → 报告生成** 的完整流程，致力于复杂任务的智能化管理与执行。其核心模块包括：

- **Planning Agent**：理解用户意图，并将高层需求拆解为具体可执行任务链；
- **Tool Register**：动态管理已有和新生成的工具（如算子、模型或脚本）；
- **Task Dispatcher**：将任务指派给 Execution Agent，支持代码自动生成与调试；
- **Execution Agent**：执行具体任务，进行数据处理、模型调用等；
- **Evaluation Agent**：对执行结果进行质量与正确性评估；
- **Analysis Agent**：对流程和结果进行总结，生成结构化报告。

系统支持短期与长期记忆机制，能够维持多轮交互状态，在保证标准化流程的同时，具备高度的动态适应能力，尤其适用于数据治理、自动化数据分析等需要多阶段协同的复杂场景。

![Dataflow-Agent](/agent_zh.png)
