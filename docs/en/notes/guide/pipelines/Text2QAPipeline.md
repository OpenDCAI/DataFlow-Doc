---
title: Text-to-QA Data Synthesis Pipeline
icon: solar:palette-round-linear
createTime: 2025/06/16 13:08:42  
permalink: /en/guide/text2qa_pipeline/  
---

# Text-to-QA Data Synthesis Pipeline

## 1. Overview

The **Text-to-QA Data Synthesis Pipeline** automatically generates high-quality Q&A pairs from raw text and evaluates their quality, suitable for building datasets for document QA training.

We support the following use cases:

- Synthesis of training data for document QA
- Automatically constructing high-quality Q&A pairs from provided text

The main stages of the pipeline include:

1. **Content selection**: choose representative content from large volumes of text as the basis for Q&A generation.
2. **Q&A generation**: generate questions and answers based on text content.
3. **Quality evaluation**: score and provide feedback on Q&A pairs across multiple dimensions.

## 2. Quick Start

### Step 1: Install dataflow
```shell
pip install open-dataflow
```

### Step 2: Create a new dataflow workspace
```shell
mkdir run_dataflow
cd run_dataflow
```

### Step 3: Initialize Dataflow
```shell
dataflow init
```
You will see
```shell
run_dataflow/pipelines/api_pipelines/text2qa_pipeline.py  
```

### Step 4: Set your API key and api_url
For Linux and macOS
```shell
export DF_API_KEY="sk-xxxxx"
```

For Windows
```powershell
$env:DF_API_KEY = "sk-xxxxx"
```
In `text2qa_pipeline.py`, set api_url like:
```python
self.llm_serving = APILLMServing_request(
        api_url="https://api.openai.com/v1/chat/completions",
        model_name="gpt-4o",
        max_workers=1
)
```

### Step 5: One-click run
```bash
python pipelines/api_pipelines/text2qa_pipeline.py
```
You can also run any other pipeline script as needed; the process is similar. Below we introduce the operators used in the pipeline and how to configure them.

## 3. Data Flow and Pipeline Logic

### 1. **Input Data**

The pipeline input includes the following fields:

* **text**: raw text content

Inputs can be stored in designated files (such as `json` or `jsonl`) and managed and read via the `FileStorage` object. In the provided example, the default data path is loaded; in practice, you can modify the path to load custom data and cache paths:

```python
self.storage = FileStorage(
            first_entry_file_name="../example_data/core_text_data/pipeline_small_chunk.json",
            cache_path="./cache_local",
            file_name_prefix="dataflow_cache_step",
            cache_type="json",
        )
```

### 2. **Content Selection (KCenterGreedyFilter)**

#### 2.1 **Sampling**

The first step is to use the **Sampling** operator (`KCenterGreedyFilter`) to select a portion of text content from a large dataset. This step is crucial because it determines which text content will be used in the subsequent generation process.

**Functionality:**

* Identify and select representative text content from a set of textual contexts

**Input:** Original text content

**Output:** Selected text content

```python
self.llm_serving = APILLMServing_request(
        api_url="https://api.openai.com/v1/chat/completions",
        model_name="gpt-4o",
        max_workers=1
)

embedding_serving = APILLMServing_request(
            api_url="https://api.openai.com/v1/embeddings",
            model_name="text-embedding-ada-002",
            max_workers=100
)

self.content_chooser_step1 = KCenterGreedyFilter(embedding_serving=embedding_serving, num_samples=5)

result = self.content_chooser_step1.run(
            storage = self.storage.step(),
            input_key = "text"
        )
```

### 3. **Q&A Generation (Text2QAGenerator)**

The second step is to use the **Q&A Generator** (`Text2QAGenerator`) to generate multiple questions and answers for each text input.

**Functionality:**

* Directly generate questions and answers from text; configurable number of questions

**Input:** Selected text content  
**Output:** Generated prompts, questions, and answers

```python
self.text2qa_generator_step3 = Text2QAGenerator(self.llm_serving)
result = self.text2qa_generator_step3.run(
            storage = self.storage.step(),
            input_key="text",
            input_question_num=3,
            output_prompt_key="generated_prompt",
            output_quesion_key="generated_question",
            output_answer_key="generated_answer"
        )
```

### 4. **Q&A Quality Evaluation (Text2QASampleEvaluator)**

The third step is to use the **Q&A Scorer** (`Text2QASampleEvaluator`) to evaluate the generated Q&A pairs with multi-dimensional scores and feedback.

**Functionality:**

* Evaluate Q&A pairs on dimensions such as question quality, answer alignment, and answer verifiability, and produce feedback

**Input:** Generated Q&A pairs  
**Output:** Scores and feedback for each Q&A pair

```python
self.text2qa_scorer_step4 = Text2QASampleEvaluator(self.llm_serving)
result = self.text2qa_scorer_step4.run(
            storage = self.storage.step(),
            input_question_key="generated_question",
            input_answer_key="generated_answer",
            output_question_quality_key="question_quality_grades",
            output_question_quality_feedback_key="question_quality_feedbacks",
            output_answer_alignment_key="answer_alignment_grades",
            output_answer_alignment_feedback_key="answer_alignment_feedbacks",
            output_answer_verifiability_key="answer_verifiability_grades",
        )
```

### 5. **Output Data**

The final output includes:

* **generated_prompt**: generated prompt
* **generated_question**: generated question
* **generated_answer**: generated answer
* **question_quality_grades**: question quality scores
* **question_quality_feedbacks**: question quality feedback
* **answer_alignment_grades**: answer alignment scores
* **answer_alignment_feedbacks**: answer alignment feedback
* **answer_verifiability_grades**: answer verifiability scores

## 4. Pipeline Example

An example pipeline demonstrating how to chain content selection, Q&A generation, and quality evaluation:

```python
from dataflow.operators.core_text import (
    Text2QASampleEvaluator,
    Text2QAGenerator,
    KCenterGreedyFilter
)

from dataflow.utils.storage import FileStorage
from dataflow.serving import APILLMServing_request
from dataflow.serving import LocalModelLLMServing_vllm

class AgenticRAG_APIPipeline():
    def __init__(self):

        self.storage = FileStorage(
            first_entry_file_name="../example_data/core_text_data/pipeline_small_chunk.json",
            cache_path="./cache_local",
            file_name_prefix="dataflow_cache_step",
            cache_type="json",
        )

        # use API server as LLM serving
        self.llm_serving = APILLMServing_request(
                api_url="https://api.openai.com/v1/chat/completions",
                model_name="gpt-4o",
                max_workers=1
        )

        embedding_serving = APILLMServing_request(
                    api_url="https://api.openai.com/v1/embeddings",
                    model_name="text-embedding-ada-002",
                    max_workers=100
        )

        self.content_chooser_step1 = KCenterGreedyFilter(embedding_serving=embedding_serving, num_samples=5)

        self.text2qa_generator_step3 = Text2QAGenerator(self.llm_serving)

        self.text2qa_scorer_step4 = Text2QASampleEvaluator(self.llm_serving)
        
    def forward(self):

        self.content_chooser_step1.run(
            storage = self.storage.step(),
            input_key = "text"
        )

        self.text2qa_generator_step3.run(
            storage = self.storage.step(),
            input_key="text",
            input_question_num= 3,
            output_prompt_key="generated_prompt",
            output_quesion_key="generated_question",
            output_answer_key="generated_answer"
        )

        self.text2qa_scorer_step4.run(
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
    model = AgenticRAG_APIPipeline()
    model.forward()
```