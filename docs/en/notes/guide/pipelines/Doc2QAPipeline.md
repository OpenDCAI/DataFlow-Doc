---
title: Doc-to-QA Data Synthesis Pipeline
icon: solar:palette-round-linear
createTime: 2025/06/16 13:08:42  
permalink: /en/guide/doc2qa_pipeline/  
---

# Doc-to-QA Data Synthesis Pipeline

## 1. Overview

The **Doc-to-QA Data Synthesis Pipeline** is an end-to-end framework to:  
- Support RL-based agentic RAG training.
- Generate high-quality pairs of questions and answers from provided text contents.

This pipeline only need text contexts for generating high-quality questions and answers for further training  

---

## 2. Data Flow and Pipeline Logic

### 1. **Input Data**

The input data for the pipeline includes the following fields:

* **text**: various text contents 

These input data can be stored in designated files (such as `json` or `jsonl`) and managed and read via the `FileStorage` object. In the provided example, the default data path is loaded. In practical use, you can modify the path to load custom data and cache paths:

```python
self.storage = FileStorage(
            first_entry_file_name="../example_data/core_text_data/pipeline_small_chunk.json",
            cache_path="./cache_local",
            file_name_prefix="dataflow_cache_step",
            cache_type="json",
        )
```

### 2. **Content Selection**

#### 2.1 **Sample Sampling**

The first step of the process is to use the **Sampling** operator (`KCenterGreedyFilter`) to select a portion of text content from a large dataset. This step is crucial because it determines which text content will be used in the subsequent generation process.

**Functionality:**

* Identifies and selects representative text content from a set of textual contexts.

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

### 3. **Question and Answer Generation**

#### 3.1 **Automatic Prompt Generation**

The second step of the process is to use the **Automatic Prompt Generator** operator (`Doc2PromptGenerator`) to automatically generate dedicated prompts for question and answer generation. This step ensures that each selected text content is paired with an appropriate prompt for the subsequent Q&A generation.

**Functionality:**

* Automatically generates suitable prompts for each selected text content to guide the Q&A generation process.

**Input:** Selected text content  
**Output:** Generated prompts for each text content

```python
self.doc2prompt_generator_step2 = Doc2PromptGenerator(self.llm_serving)
result = doc2prompt_generator_step2.run(
            storage = self.storage.step(),
            input_key = "text",
            output_key = "generated_prompt"
        )
```

---

#### 3.2 **Q&A Pair Generation**

The third step of the process is to use the **Q&A Generator** operator (`Doc2QAGenerator`) to generate Q&A pairs for each text content and its corresponding prompt. This step produces the core data for subsequent evaluation and use.

**Functionality:**

* Generates questions and their corresponding answers based on the text content and the generated prompts.

**Input:** Selected text content and its generated prompts  
**Output:** Generated Q&A pairs

```python
self.doc2qa_generator_step3 = Doc2QAGenerator(self.llm_serving)
result = self.doc2qa_generator_step3.run(
            storage = self.storage.step(),
            input_key="text",
            output_prompt_key="generated_prompt",
            output_quesion_key="generated_question",
            output_answer_key="generated_answer"
        )
```

---

#### 3.3 **Q&A Pair Scoring**

The fourth step of the process is to use the **Q&A Scorer** operator (`Doc2QASampleEvaluator`) to evaluate the quality of the generated Q&A pairs. This step provides multi-dimensional scores and feedback for each Q&A pair, supporting further filtering and improvement.

**Functionality:**

* Evaluates the generated Q&A pairs from multiple dimensions (such as question quality, answer consistency, answer verifiability, and downstream value), and provides scores and detailed feedback.

**Input:** Generated Q&A pairs  
**Output:** Evaluation scores and feedback for each Q&A pair

```python
self.doc2qa_scorer_step4 = Doc2QASampleEvaluator(self.llm_serving)
result = self.doc2qa_scorer_step4.run(
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

## 3. Running the Process

Run the complete process:

```python
from dataflow.operators.core_text import (
    Doc2PromptGenerator,
    Doc2QASampleEvaluator,
    Doc2QAGenerator,
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

        self.doc2prompt_generator_step2 = Doc2PromptGenerator(self.llm_serving)

        self.doc2qa_generator_step3 = Doc2QAGenerator(self.llm_serving)

        self.doc2qa_scorer_step4 = Doc2QASampleEvaluator(self.llm_serving)
        
    def forward(self):

        self.content_chooser_step1.run(
            storage = self.storage.step(),
            input_key = "text"
        )

        self.doc2prompt_generator_step2.run(
            storage = self.storage.step(),
            input_key = "text"
        )

        self.doc2qa_generator_step3.run(
            storage = self.storage.step(),
            input_key="text",
            output_prompt_key="generated_prompt",
            output_quesion_key="generated_question",
            output_answer_key="generated_answer"
        )

        self.doc2qa_scorer_step4.run(
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