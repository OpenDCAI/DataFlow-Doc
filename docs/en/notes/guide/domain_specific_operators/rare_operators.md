---
title: RARE Operators
createTime: 2025/09/26 11:47:42
permalink: /en/guide/RARE_operators/
---


# RARE Operators

## Overview

RARE (Retrieval-Augmented Reasoning Modeling) is a novel training paradigm centered around the core idea of **decoupling knowledge storage from reasoning optimization**. RARE externalizes domain knowledge to a retrievable external data source, focusing the training process on internalizing domain-specific reasoning patterns. Specifically, by injecting retrieved knowledge into training prompts, RARE shifts the model's learning objective from rote memorization of facts to context-based reasoning. This approach allows the model to bypass the process of storing knowledge in its parameters, prioritizing the development and optimization of higher-order cognitive and reasoning abilities. We have meticulously designed and **independously developed** a new set of operators, with the following symbolic meanings:

  - 🚀 **Autonomous Innovation**: Core algorithms originally developed by our team, filling gaps in existing algorithms or further enhancing performance to break through current bottlenecks.
  - ✨ **Open-Source Debut**: The first integration of this operator into a mainstream community framework, making it accessible to a broader range of developers for open-source sharing.

## RARE Operators

The RARE operator workflow systematically generates synthetic data for reasoning ability training through three core steps.

| Name | Application Type | Description | Official Repository or Paper |
| :--- | :--- | :--- | :--- |
| RAREDoc2QueryGenerator✨ | Question Generation | Generates complex reasoning questions and corresponding scenarios based on original documents. | ReasonIR: Training Retrievers for Reasoning Tasks |
| RAREBM25HardNegGenerator✨ | Hard Negative Mining | Mines hard negative samples that are textually similar but semantically irrelevant to the generated questions to construct challenging retrieval contexts. | ReasonIR: Training Retrievers for Reasoning Tasks |
| RAREReasonDistillGenerator🚀 | Reasoning Process Generation | Combines the question, positive, and negative documents to prompt a large language model to generate a detailed reasoning process, "distilling" its domain thinking patterns. | RARE: Retrieval-Augmented Reasoning Modeling |

## Operator Interface Usage Instructions

For operators that require specifying storage paths or calling models, we provide encapsulated **model interfaces** and **storage object interfaces**. You can predefine the model API parameters for an operator as follows:

```python
from dataflow.serving.api_llm_serving_request import APILLMServing_request

api_llm_serving = APILLMServing_request(
                api_url="your_api_url",
                key_name_of_api_key="YOUR_API_KEY",
                model_name="model_name",
                max_workers=5
        )
```
You can predefine the storage parameters for an operator as follows:

```python
from dataflow.utils.storage import FileStorage

self.storage = FileStorage(
            first_entry_file_name="your_file_path",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="json", # jsonl, json, ...
        )
```

In the following sections, `api_llm_serving` and `self.storage` refer to the interface objects defined here. For a complete usage example, please see `rare_pipeline.py`.

Regarding parameter passing, the constructor of an operator object primarily receives configuration-related information (such as an `llm_serving` instance), which can be configured once and used multiple times. The `X.run()` function, on the other hand, passes IO-related `key` information and runtime parameters. Specific details are provided in the operator descriptions below.

## Detailed Operator Descriptions

### 1\. RAREDoc2QueryGenerator

**Functional Description**

This operator is the first step in the RARE data generation workflow. It utilizes a large language model to generate a standalone question from a given document snippet that requires in-depth reasoning to answer, along with a complete scenario description. The generated question is designed to be understandable without the original text, testing the model's comprehensive reasoning abilities rather than simple information extraction.

**Input Parameters**

  - `__init__()`
      - `llm_serving`: The large language model interface object to be used (of type `LLMServingABC`).
  - `run()`
      - `storage`: The storage interface object.
      - `input_key`: The field name for the input document content (default: `"text"`).
      - `output_question_key`: The field name for the output generated question (default: `"question"`).
      - `output_scenario_key`: The field name for the output generated scenario (default: `"scenario"`).
      - `max_attempts`: The maximum number of retry attempts to call the large model for a single sample upon parsing failure (default: 3).

**Usage Example**

```python
from dataflow.operators.rare import RAREDoc2QueryGenerator

doc2query_step = RAREDoc2QueryGenerator(llm_serving=api_llm_serving)
doc2query_step.run(
    storage=self.storage.step(),
    input_key="text",
    output_question_key="question",
    output_scenario_key="scenario"
)
```

### 2\. RAREBM25HardNegGenerator

**Functional Description**

This operator uses the classic BM25 algorithm to retrieve and select the most relevant hard negative samples from the entire document corpus for each "question-positive document" pair. These negative samples are lexically similar to the query but are semantically incorrect or irrelevant answers. The goal is to create a challenging retrieval environment that forces the model to perform finer-grained reasoning and discrimination in subsequent steps.

**Dependency Installation**

The RAREBM25HardNegGenerator operator depends on pyserini, gensim, and JDK. The configuration method for Linux is as follows:
```Bash
sudo apt install openjdk-21-jdk
pip install pyserini gensim
```

**Input Parameters**

  - `__init__()`
      - No constructor parameters.
  - `run()`
      - `storage`: The storage interface object.
      - `input_question_key`: The field name for the input question (default: `"question"`).
      - `input_text_key`: The field name for the input positive document content (default: `"text"`).
      - `output_negatives_key`: The field name for the output list of hard negative samples (default: `"hard_negatives"`).
      - `num_neg`: The number of hard negative samples to mine for each query (default: 3).

**Usage Example**

```python
from dataflow.operators.rare import RAREBM25HardNegGenerator

bm25hardneg_step = RAREBM25HardNegGenerator()
bm25hardneg_step.run(
    storage=self.storage.step(),
    input_question_key="question",
    input_text_key="text",
    output_negatives_key="hard_negatives",
    num_neg=3
)
```

### 3\. RAREReasonDistillGenerator

**Functional Description**

This operator is the core implementation of the RARE paradigm. It integrates the question and scenario generated by `RAREDoc2QueryGenerator`, the original positive document, and the hard negatives mined by `RAREBM25HardNegGenerator` to construct a complex context. It then prompts a large language model (the teacher model) to generate a detailed, step-by-step reasoning process based on this context. This process aims to "distill" the teacher model's domain thinking patterns and generate data for training a student model, teaching it how to perform contextualized reasoning rather than relying on parameterized knowledge.

**Input Parameters**

  - `__init__()`
      - `llm_serving`: The large language model interface object to be used (of type `LLMServingABC`).
  - `run()`
      - `storage`: The storage interface object.
      - `input_text_key`: The field name for the input positive document (default: `"text"`).
      - `input_question_key`: The field name for the input question (default: `"question"`).
      - `input_scenario_key`: The field name for the input scenario (default: `"scenario"`).
      - `input_hardneg_key`: The field name for the input list of hard negative samples (default: `"hard_negatives"`).
      - `output_key`: The field name for the output generated reasoning process (default: `"reasoning"`).

**Usage Example**

```python
from dataflow.operators.rare import RAREReasonDistillGenerator

reasondistill_step = RAREReasonDistillGenerator(llm_serving=api_llm_serving)
reasondistill_step.run(
    storage=self.storage.step(),
    input_text_key="text",
    input_question_key="question",
    input_scenario_key="scenario",
    input_hardneg_key="hard_negatives",
    output_key="reasoning"
)
```