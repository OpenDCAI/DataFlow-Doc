---
title: RARE算子
createTime: 2025/09/26 11:44:42
permalink: /zh/guide/RARE_operators/
---

# RARE 算子

## 概述

RARE (Retrieval-Augmented Reasoning Modeling) 是一种新颖的训练范式，其核心思想在于**将知识存储与推理优化相解耦**。RARE 将领域知识外化至可检索的外部数据源，训练过程中专注于内化领域特定的推理模式。具体而言，通过将检索到的知识注入训练提示中，RARE 将模型的学习目标从对事实的死记硬背转变为基于上下文的推理。这种方法使模型能够绕过参数密集的知识记忆过程，优先发展和优化更高阶的认知与推理能力。我们精心设计并**自研**了新的算子集，其标记含义如下：

- 🚀 **自主创新**：核心算法原创研发，填补现有算法空白或是进一步提升性能，突破当下性能瓶颈。
- ✨ **开源首发**：首次将该算子集成到社区主流框架中，方便更多开发者使用，实现开源共享。

## RARE 算子

RARE 算子流程通过三个核心步骤，系统性地生成用于推理能力训练的合成数据。

<table class="tg">
  <thead>
    <tr>
      <th class="tg-0pky">名称</th>
      <th class="tg-0pky">应用类型</th>
      <th class="tg-0pky">描述</th>
      <th class="tg-0pky">官方仓库或论文</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="tg-0pky">RAREDoc2QueryGenerator✨</td>
      <td class="tg-0pky">问题生成</td>
      <td class="tg-0pky">基于原始文档，生成需要复杂推理才能解答的问题和相应场景。</td>
      <td class="tg-0pky">ReasonIR: Training Retrievers for Reasoning Tasks</td>
    </tr>
    <tr>
      <td class="tg-0pky">RAREBM25HardNegGenerator✨</td>
      <td class="tg-0pky">困难负例挖掘</td>
      <td class="tg-0pky">为生成的问题挖掘文本相似但语义不相关的困难负样本，构建具有挑战性的检索上下文。</td>
      <td class="tg-0pky">ReasonIR: Training Retrievers for Reasoning Tasks</td>
    </tr>
    <tr>
      <td class="tg-0pky">RAREReasonDistillGenerator🚀</td>
      <td class="tg-0pky">推理过程生成</td>
      <td class="tg-0pky">结合问题、正负文档，提示大语言模型生成详尽的推理过程，以“蒸馏”其领域思维模式。</td>
      <td class="tg-0pky">RARE: Retrieval-Augmented Reasoning Modeling</td>
    </tr>
  </tbody>
</table>

## 算子接口使用说明

对于指定存储路径或调用模型的算子，我们提供了封装好的**模型接口**和**存储对象接口**。你可以通过如下方式为算子预定义模型 API 参数：

```python
from dataflow.serving.api_llm_serving_request import APILLMServing_request

api_llm_serving = APILLMServing_request(
                api_url="your_api_url",
                key_name_of_api_key="YOUR_API_KEY",
                model_name="model_name",
                max_workers=5
        )
```

你可以通过如下方式为算子预定义存储参数：

```python
from dataflow.utils.storage import FileStorage

self.storage = FileStorage(
            first_entry_file_name="your_file_path",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="json", # jsonl, json, ...
        )
```

下文中的 `api_llm_serving` 和 `self.storage` 即为此处定义的接口对象。完整的使用示例可见 `test_rare.py`。

参数传递方面，算子对象的构造函数主要传递与算子配置相关的信息（如 `llm_serving` 实例），可一次配置多次调用；而 `X.run()` 函数则传递与 IO 相关的 `key` 信息和运行时参数。具体细节可见下方算子描述示例。

## 算子详细说明

### 1. RAREDoc2QueryGenerator

**功能描述**

该算子是 RARE 数据生成流程的第一步。它利用大语言模型，为给定的文档片段生成一个独立的、需要深入推理才能解答的问题，并附带一个完整的场景描述。生成的问题旨在脱离原文也能被理解，考验模型的综合推理能力而非简单的信息抽取。

**输入参数**

- `__init__()`
  - `llm_serving`: 使用的大语言模型接口对象（`LLMServingABC` 类型）。
- `run()`
  - `storage`: 存储接口对象。
  - `input_key`: 输入文档内容的字段名（默认："text"）。
  - `output_question_key`: 输出生成问题的字段名（默认："question"）。
  - `output_scenario_key`: 输出生成场景的字段名（默认："scenario"）。
  - `max_attempts`: 解析失败时，为单一样本重新调用大模型的最大尝试次数（默认：3）。

**使用示例**

```python
from dataflow.operators.rare import RAREDoc2QueryGenerator

doc2query_step = RAREDoc2QueryGenerator(llm_serving=api_llm_serving)
doc2query_step.run(
    storage = self.storage.step(),
    input_key = "text",
    output_question_key = "question",
    output_scenario_key = "scenario"
)
```

### 2. RAREBM25HardNegGenerator

**功能描述**

该算子利用经典的 BM25 算法，为每个“问题-正面文档”对，从整个文档库中检索并筛选出最相关的困难负样本。这些负样本在词汇上与查询高度相似，但在语义上是错误的或不相关的答案，旨在构建一个具有挑战性的检索环境，迫使模型在后续步骤中进行更精细的推理和辨别。

**依赖安装**

RAREBM25HardNegGenerator算子依赖于pyserini, gensim和JDK。Linux配置方法如下：
```Bash
sudo apt install openjdk-21-jdk
pip install pyserini gensim
```

**输入参数**

- `__init__()`
  - 无构造参数。
- `run()`
  - `storage`: 存储接口对象。
  - `input_question_key`: 输入问题的字段名（默认："question"）。
  - `input_text_key`: 输入正面文档内容的字段名（默认："text"）。
  - `output_negatives_key`: 输出困难负样本列表的字段名（默认："hard_negatives"）。
  - `num_neg`: 为每个查询挖掘的困难负样本数量（默认：3）。

**使用示例**

```python
from dataflow.operators.rare import RAREBM25HardNegGenerator

bm25hardneg_step = RAREBM25HardNegGenerator()
bm25hardneg_step.run(
    storage = self.storage.step(),
    input_question_key = "question",
    input_text_key = "text",
    output_negatives_key = "hard_negatives",
    num_neg = 3
)
```

### 3. RAREReasonDistillGenerator

**功能描述**

该算子是 RARE 范式的核心实现。它将 `RAREDoc2QueryGenerator` 生成的问题和场景、原始的正面文档以及 `RAREBM25HardNegGenerator` 挖掘出的困难负例整合在一起，构建一个复杂的上下文。然后，它提示大语言模型（教师模型）基于此上下文生成一个详尽的、分步的推理过程。这个过程旨在“蒸馏”出大模型的领域思维模式（domain thinking），并生成用于训练学生模型的数据，使其学会如何进行上下文推理（contextualized reasoning）而非依赖参数化知识。

**输入参数**

- `__init__()`
  - `llm_serving`: 使用的大语言模型接口对象（`LLMServingABC` 类型）。
- `run()`
  - `storage`: 存储接口对象。
  - `input_text_key`: 输入正面文档的字段名（默认："text"）。
  - `input_question_key`: 输入问题的字段名（默认："question"）。
  - `input_scenario_key`: 输入场景的字段名（默认："scenario"）。
  - `input_hardneg_key`: 输入困难负样本列表的字段名（默认："hard_negatives"）。
  - `output_key`: 输出生成推理过程的字段名（默认："reasoning"）。

**使用示例**

```python
from dataflow.operators.rare import RAREReasonDistillGenerator

reasondistill_step = RAREReasonDistillGenerator(llm_serving=api_llm_serving)
reasondistill_step.run(
    storage = self.storage.step(),
    input_text_key = "text",
    input_question_key = "question",
    input_scenario_key = "scenario",
    input_hardneg_key = "hard_negatives",
    output_key = "reasoning"
)
```