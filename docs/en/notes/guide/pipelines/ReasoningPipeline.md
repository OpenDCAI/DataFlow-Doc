---

title: Reasoning Data Synthesis Pipeline
icon: mdi:brain
createTime: 2025/06/16 13:08:42
permalink: /en/guide/reasoningpipeline/

---

# Reasoning Data Synthesis Pipeline

## 1. Overview

The core objective of the **Strong Reasoning Data Synthesis Pipeline** is to expand the scale and diversity of existing datasets through the synthesis and processing of mathematical question-answer data, thereby providing richer training data for model fine-tuning. The pipeline includes multiple processing steps (such as question filtering, question synthesis, answer generation and verification, etc.), transforming raw mathematical problem data into high-quality question-answer data, further classifying, scoring difficulty, and deduplicating the generated data, ultimately forming high-quality datasets suitable for various reasoning tasks.

We support the following application scenarios:

* High-quality synthesis of strong reasoning instruction fine-tuning data
* Generation of large-scale mathematical pretraining data

The main processes of the pipeline include:

1. **Question Processing**: Filtering non-mathematical problems, synthesizing new problems, verifying problem correctness, conducting difficulty scoring and category classification.
2. **Answer Generation and Processing**: Processing based on standard answers or model-generated answers for problems, including format filtering, length filtering, and correctness verification.
3. **Data Deduplication**: Deduplicating generated question-answer data to ensure dataset quality.

## 2. Data Flow and Pipeline Logic

### 1. **Input Data**

The input data for the pipeline mainly includes the following fields:

* **instruction**: Question text, usually mathematical problems or task descriptions.
* **golden\_answer**: Standard answer (if exists), applicable to datasets containing standard answers.
* **solution**: Known solutions or reasoning processes (if exists).

This input data can be stored in specified files (such as `json`, `jsonl`) and managed and read through `FileStorage` objects. The example will load default data paths, but in actual usage scenarios, paths can be modified according to needs to load custom data and cache paths:

```python
self.storage = FileStorage(
    first_entry_file_name="../dataflow/example/ReasoningPipeline/pipeline_math_short.json",
    cache_path="./cache_local",
    file_name_prefix="dataflow_cache_step",
    cache_type="jsonl",
)
```

### 2. **Question Handling**

#### 2.1 **Question Filtering (ReasoningQuestionFilter)**

The first step of the pipeline is to eliminate invalid mathematical problems through the **Question Filter** (`ReasoningQuestionFilter`). This step is crucial as it ensures that problems entering subsequent steps are valid mathematical problems, avoiding irrelevant or incorrect problems from affecting subsequent data synthesis.

**Function:**

* Remove non-mathematical problems (such as natural language problems, non-mathematical problems, etc.).
* Ensure the model only processes valid mathematical problems.

**Input**: Raw mathematical problems
**Output**: Cleaned valid mathematical problems

```python
question_filter = ReasoningQuestionFilter(
    llm_serving=api_llm_serving,
    system_prompt="You are a math problem validator."
    )
```

#### 2.2 **Question Synthesis (ReasoningQuestionGenerator)**

After problems pass filtering, the **Question Synthesis** (`ReasoningQuestionGenerator`) step generates new mathematical problems based on existing problems to enhance dataset diversity and scale.

**Function:**

* Generate new variants or similar problems based on existing problems.
* Enhance datasets and improve model generalization capabilities.

**Input**: Filtered valid problems
**Output**: Synthesized new problems

```python
question_gen = ReasoningQuestionGenerator(
                num_prompts=3,  # from 1 to k
                llm_serving=api_llm_serving
                )
```

#### 2.3 **Question Filtering (ReasoningQuestionFilter)**

The newly generated problems will go through the **Question Filtering** step again to ensure their validity. This step ensures that generated problems meet mathematical reasoning standards and filters out synthesized problems that don't meet criteria.

**Function:**

* Re-verify problem validity.
* Filter out unqualified synthesized problems.

**Input**: Synthesized new problems
**Output**: Valid synthesized problems

```python
question_filter = ReasoningQuestionFilter(
    llm_serving=api_llm_serving,
    system_prompt="You are a math problem validator."
    )
```

#### 2.4 **Question Difficulty Classification (ReasoningQuestionDifficultySampleEvaluator)**

**Question Difficulty Classification** (`ReasoningQuestionDifficultySampleEvaluator`) scores the difficulty of synthesized problems. This step classifies problems by difficulty level, facilitating subsequent data analysis and model fine-tuning.

**Function:**

* Assign difficulty scores (0-10 points) to each problem.
* Provide difficulty labels for problems for subsequent analysis.

**Input**: Valid synthesized problems
**Output**: Difficulty scores for each problem

```python
difficulty = ReasoningQuestionDifficultySampleEvaluator(llm_serving=api_llm_serving)
```

#### 2.5 **Question Category Classification (ReasoningQuestionCategorySampleEvaluator)**

**Question Category Classification** (`ReasoningQuestionCategorySampleEvaluator`) classifies problems by mathematical categories (such as algebra, geometry, probability, etc.). This step facilitates subsequent analysis of problem distribution and diversity.

**Function:**

* Classify problems into different mathematical categories (e.g., geometry, combinatorial mathematics, etc.).
* Facilitate subsequent analysis and grouped processing.

**Input**: Valid synthesized problems
**Output**: Category labels for problems

```python
classifier = ReasoningQuestionCategorySampleEvaluator(llm_serving=api_llm_serving)
```

### 3. **Answer Handling**

#### 3.1 **Answer Branch (ReasoningAnswerPipelineRootFilter)**

After question processing, the pipeline enters the answer generation part. If the data contains standard answers (`golden_answer`), the data flow will enter a processing branch; otherwise, it will enter the pseudo-answer generation path.

**Function:**

* Decide whether to use standard answers or generate pseudo-answers.
* If there are standard answers, generate reasoning processes related to them; if not, generate pseudo-answers through the model.

**Input**: Question output (and standard answers, if any)
**Output**: Standard answer branch or pseudo-answer branch

```python
branch = ReasoningAnswerPipelineRootFilter()
```

#### 3.2 **Answer Generation (ReasoningAnswerGenerator)**

For cases containing standard answers, the **Answer Generation** (`ReasoningAnswerGenerator`) step will generate answers with reasoning processes, providing long-chain reasoning processes to increase answer reliability and transparency. For cases without standard answers, this step is **Pseudo-Answer Generation** (ReasoningPseudoAnswerGenerator), which requires the model to answer the same question multiple times and votes for the most frequent answer as the **pseudo-answer**.

**Function:**

* Generate detailed reasoning processes based on problems and standard answers.
* Ensure answers are transparent and interpretable.

**Input**: Question text (and standard answers)
**Output**: With standard answers: model-generated reasoning processes (long-chain reasoning); Without standard answers: pseudo-answers and long-chain reasoning processes.

```python
answer_gen = ReasoningAnswerGenerator(llm_serving=api_llm_serving)
```

#### 3.3 **Answer Format Filtering (ReasoningAnswerFormatterFilter)**

Generated answers will go through the **Answer Format Filtering** (`ReasoningAnswerFormatterFilter`) step to ensure they meet preset format requirements. This step ensures that generated answers are structured and valid, avoiding answers that don't meet format requirements from affecting subsequent processing.

**Function:**

* Ensure answer formats meet requirements.

**Input**: Generated answers (long-chain reasoning)
**Output**: Answers meeting format requirements

```python
filter_op = ReasoningAnswerFormatterFilter()
```

#### 3.4 **Answer Length Filtering (ReasoningAnswerTokenLengthFilter)**

Next, the **Answer Length Filtering** (`ReasoningAnswerTokenLengthFilter`) step will filter based on preset maximum answer lengths, eliminating answers that are too long or too short, ensuring generated answers have appropriate lengths.

**Function:**

* Filter out answers that are too long or too short, ensuring answer lengths are within reasonable ranges.

**Input**: Generated answers
**Output**: Answers meeting length requirements

```python
length_filter = ReasoningAnswerTokenLengthFilter(
                  max_answer_token_length=8192,
                  tokenizer_dir="Qwen/Qwen2.5-0.5B-Instruct"
                  )
```

#### 3.5 **Answer Verification and Deduplication (ReasoningAnswerGroundTruthFilter, ReasoningAnswerNgramFilter)**

Finally, generated answers will go through **Answer Verification** (`ReasoningAnswerGroundTruthFilter`) and **Answer Deduplication** (`ReasoningAnswerNgramFilter`) steps:

* **Answer Verification**: Verify answer accuracy by comparing with standard answers.
* **Answer Deduplication**: Use N-gram algorithms to remove duplicate answers, ensuring each problem's answer is unique and non-repetitive.

**Function:**

* Verify answer accuracy.
* Deduplicate to ensure answer uniqueness.

**Input**: Generated answers
**Output**: Verified and deduplicated answers

```python
filter_op = ReasoningAnswerGroundTruthFilter(compare_method="math_verify")
ngram_filter = ReasoningAnswerNgramFilter(
                min_score=0.1,
                max_score=1.0,
                ngrams=5
                )
```

### 4. **Output Data**

Finally, the output data generated by the pipeline will contain the following content:

* **instruction**: Question text
* **generated\_cot**: Model-generated long-chain reasoning process
* **output**: Model-generated final answer
* **golden\_answer**: Standard answer (if any)
* **Synth\_or\_Input**: Data source marker, `input` indicates original data, `synth` indicates pipeline-synthesized data
* **Difficulty**: Problem difficulty score (0–10)
* **primary\_category**: Primary category of the problem
* **secondary\_category**: Secondary category of the problem

## 3. Execution Methods

The pipeline executes different configurations through simple Python commands to meet different data needs:

* **Strong reasoning instruction fine-tuning data synthesis**:

  ```bash
  python test/test_reasoning.py
  ```

* **Large-scale pretraining data synthesis**:

  ```bash
  python test/test_reasoning_pretrain.py
  ```

## 4. Pipeline Example

The following provides an example pipeline demonstrating how to use multiple operators for reasoning data processing. This example shows how to initialize a reasoning data processing pipeline and sequentially execute various filtering and cleaning steps.

```python
class ReasoningPipeline():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="../example_data/ReasoningPipeline/pipeline_math_short.json",
            cache_path="./cache_local",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        if llm_serving is None:
            llm_serving = LocalModelLLMServing(
                model_name_or_path="Qwen/Qwen2.5-7B-Instruct",
                tensor_parallel_size=1,
                max_tokens=8192,
                model_source="local"
            )
        self.question_filter_step1 = ReasoningQuestionFilter(
            system_prompt="You are an expert in evaluating mathematical problems. Follow the user's instructions strictly and output your final judgment in the required JSON format.",
            llm_serving=llm_serving
        )
        self.question_gen_step2 =  ReasoningQuestionGenerator(
            num_prompts=3,
            llm_serving=llm_serving
        )
        self.question_filter_step3 = ReasoningQuestionFilter(
            system_prompt="You are an expert in evaluating mathematical problems. Follow the user's instructions strictly and output your final judgment in the required JSON format.",
            llm_serving=llm_serving
        )
        self.question_difficulty_classifier_step4 = ReasoningQuestionDifficultySampleEvaluator(
            llm_serving=llm_serving
        )
        self.question_category_classifier_step5 = ReasoningQuestionCategorySampleEvaluator(
            llm_serving=llm_serving
        )
        ########################## branch ############################
        self.answer_pipeline_root_step6 = ReasoningAnswerPipelineRootFilter()
        ########################## answer ############################
        self.answer_generator_step7 = ReasoningAnswerGenerator(
            llm_serving=llm_serving
        )
        self.answer_format_filter_step8 = ReasoningAnswerFormatterFilter()
        self.answer_token_length_filter_step9 = ReasoningAnswerTokenLengthFilter(
            max_answer_token_length = 8192,
            tokenizer_dir = "Qwen/Qwen2.5-0.5B-Instruct"
        )
        self.answer_groundtruth_filter_step10 = ReasoningAnswerGroundTruthFilter()
        self.answer_ngram_filter_step11 = ReasoningAnswerNgramFilter(
            min_score = 0.1,
            max_score = 1.0,
            ngrams = 5
        )

    def forward(self):
        self.question_filter_step1.run(
            storage = self.storage.step(),
            input_key = "instruction",
        )

        self.question_gen_step2.run(
            storage = self.storage.step(),
            input_key = "instruction",
        )

        self.question_filter_step3.run(
            storage = self.storage.step(),
            input_key = "instruction",
        )

        self.question_difficulty_classifier_step4.run(
            storage = self.storage.step(),
            input_key = "instruction",
            output_key = "question_difficulty"
        )

        self.question_category_classifier_step5.run(
            storage = self.storage.step(),
            input_key = "instruction",
            output_key = "question_category"
        )
        ############# branch #############
        self.answer_pipeline_root_step6.run(
            storage = self.storage.step(),
            input_answer_key = "output",
            input_gt_key = "golden_answer"
        )
        ############## answer #############
        self.answer_generator_step7.run(
            storage = self.storage.step(),
            input_key = "instruction", 
            output_key = "generated_cot"
        )
        self.answer_format_filter_step8.run(
            storage = self.storage.step(),
            input_key = "generated_cot",
        )
        self.answer_token_length_filter_step9.run(
            storage = self.storage.step(),
            input_key =  "generated_cot"
        )
        self.answer_groundtruth_filter_step10.run(
            storage = self.storage.step(),
            test_answer_key = "generated_cot",
            gt_answer_key =  "golden_answer"
        )
        self.answer_ngram_filter_step11.run(
            storage = self.storage.step(),
            question_key = "instruction",
            answer_key = "generated_cot"
        )
        
if __name__ == "__main__":
    model = ReasoningPipeline()
    model.forward()
```

