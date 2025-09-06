---
title: Reasoning Operators
createTime: 2025/06/24 11:43:42
permalink: /en/guide/Reasoning_operators/
---

# Reasoning Operators

## Overview

Strong reasoning operators are a specialized collection of operators designed for mathematical reasoning and problem-solving tasks. They are primarily divided into three categories: **Data Generation Operators (Generators)**, **Filter Operators (Filters)**, and **Refiner Operators (Refiners)**. These operators can handle complex mathematical reasoning tasks, including answer generation, verification, filtering, and formatting, while supporting various mathematical representation formats.

The variety of open-source operators is quite limited. To achieve better data processing quality and fill the gaps in open-source data synthesis and processing methods, we have carefully designed and **self-developed** a new operator set. The marking meanings are as follows:

- 🚀 **Independent Innovation**: Core algorithms developed from scratch, filling existing algorithmic gaps or further improving performance, breaking through current performance bottlenecks.
- ✨ **Open Source First**: First integration of this operator into mainstream community frameworks, facilitating use by more developers and achieving open-source sharing.


## Data Generation Operators

Data generators are primarily responsible for generating various types of reasoning-related data, including answer generation, question generation, and more.

<table class="tg">
  <thead>
    <tr>
      <th class="tg-0pky">Name</th>
      <th class="tg-0pky">Application Type</th>
      <th class="tg-0pky">Description</th>
      <th class="tg-0pky">Official Repository or Paper</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="tg-0pky">ReasoningAnswerGenerator✨</td>
      <td class="tg-0pky">Answer Synthesis</td>
      <td class="tg-0pky">This operator generates standard answers for mathematical problems by calling large language models for step-by-step reasoning and computation.</td>
      <td class="tg-0pky"><a href="https://arxiv.org/abs/2410.01560">Paper</a></td>
    </tr>
    <tr>
      <td class="tg-0pky">ReasoningPseudoAnswerGenerator✨</td>
      <td class="tg-0pky">Pseudo Answer Generation & Voting</td>
      <td class="tg-0pky">This operator generates multiple candidate answers and selects the optimal solution through statistical methods to achieve pseudo answer generation.</td>
      <td class="tg-0pky"><a href="https://arxiv.org/abs/2410.01560">Paper</a></td>
    </tr>
    <tr>
      <td class="tg-0pky">ReasoningQuestionGenerator✨🚀</td>
      <td class="tg-0pky">Question Generation</td>
      <td class="tg-0pky">This operator generates new questions based on existing problems, supporting multiple generation strategies to ensure diversity.</td>
      <td class="tg-0pky">-</td>
    </tr>
    <tr>
      <td class="tg-0pky">ReasoningPretrainFormatConvertGenerator✨</td>
      <td class="tg-0pky">Format Conversion</td>
      <td class="tg-0pky">Converts SFT format data to pretraining format, supporting custom input-output key configuration</td>
      <td class="tg-0pky">-</td>
    </tr>
    <tr>
      <td class="tg-0pky">ReasoningQuestionCategorySampleEvaluator✨🚀</td>
      <td class="tg-0pky">Question Classification</td>
      <td class="tg-0pky">Performs multi-level classification of user questions based on designed and improved MSC mathematical classification standards</td>
      <td class="tg-0pky">-</td>
    </tr>
    <tr>
      <td class="tg-0pky">ReasoningQuestionDifficultySampleEvaluator✨</td>
      <td class="tg-0pky">Difficulty Assessment</td>
      <td class="tg-0pky">Evaluates question difficulty levels, outputting fine-grained difficulty scores from 1-10 levels</td>
      <td class="tg-0pky"><a href="https://arxiv.org/abs/2410.07985">Paper</a></td>
    </tr>
    <tr>
      <td class="tg-0pky">ReasoningAnswerExtractionQwenMathEvalGenerator✨</td>
      <td class="tg-0pky">Answer Extraction & Standardization</td>
      <td class="tg-0pky">Extracts standardized answer expressions from mathematical problem responses, supporting unit processing and format conversion</td>
      <td class="tg-0pky"><a href="https://github.com/QwenLM/Qwen2.5-Math">Code</a></td>
    </tr>
  </tbody>
</table>



## Processing Operators

Processing operators are primarily responsible for processing, verifying, filtering, and formatting generated data.

<table class="tg">
  <thead>
    <tr>
      <th class="tg-0pky">Name</th>
      <th class="tg-0pky">Application Type</th>
      <th class="tg-0pky">Description</th>
      <th class="tg-0pky">Official Repository or Paper</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="tg-0pky">ReasoningAnswerFormatterFilter</td>
      <td class="tg-0pky">Format Validation</td>
      <td class="tg-0pky">This operator checks whether answer formats comply with standards, primarily verifying if mathematical answers contain correct \\boxed{} notation.</td>
      <td class="tg-0pky">-</td>
    </tr>
    <tr>
      <td class="tg-0pky">ReasoningAnswerGroundTruthFilter✨</td>
      <td class="tg-0pky">Ground Truth Matching</td>
      <td class="tg-0pky">This operator compares predicted answers with ground truth answers, supporting both exact matching and mathematical verification methods.</td>
      <td class="tg-0pky">-</td>
    </tr>
    <tr>
      <td class="tg-0pky">ReasoningAnswerJudgeMathVerifyFilter✨</td>
      <td class="tg-0pky">Mathematical Answer Verification</td>
      <td class="tg-0pky">This operator verifies answer correctness through symbolic computation, performing mathematical expression parsing and equivalence verification.</td>
      <td class="tg-0pky"><a href="https://github.com/huggingface/Math-Verify">Code</a></td>
    </tr>
    <tr>
      <td class="tg-0pky">ReasoningAnswerNgramFilter✨</td>
      <td class="tg-0pky">Repetition Detection</td>
      <td class="tg-0pky">This operator filters answers based on n-gram repetition rates, detecting repetitive patterns and redundant content in responses.</td>
      <td class="tg-0pky"><a href="https://en.wikipedia.org/wiki/N-gram">Wiki</a></td>
    </tr>
    <tr>
      <td class="tg-0pky">ReasoningAnswerPipelineRootFilter✨</td>
      <td class="tg-0pky">Ground Truth Existence Classifier</td>
      <td class="tg-0pky">Root node of the answer processing pipeline, responsible for distributing input data to different processing branches based on the presence or absence of ground truth labels.</td>
      <td class="tg-0pky">-</td>
    </tr>
    <tr>
      <td class="tg-0pky">ReasoningAnswerTokenLengthFilter</td>
      <td class="tg-0pky">Length Control</td>
      <td class="tg-0pky">This operator filters overly long answers based on token count, ensuring answer length remains within reasonable limits.</td>
      <td class="tg-0pky">-</td>
    </tr>
    <tr>
      <td class="tg-0pky">ReasoningQuestionFilter✨🚀</td>
      <td class="tg-0pky">Question Validation</td>
      <td class="tg-0pky">This operator performs correctness checks on mathematical problems, including format compliance, semantic reasonableness, and condition consistency.</td>
      <td class="tg-0pky"><a href="https://github.com/scuuy/MathQ-Verify">Code</a></td>
    </tr>
  </tbody>
</table>



## Operator Interface Usage Instructions

Specifically, for operators that specify storage paths or call models, we provide encapsulated **model interfaces** and **storage object interfaces**. You can predefine model API parameters for operators in the following way:

```python
from dataflow.llmserving import APILLMServing_request

api_llm_serving = APILLMServing_request(
                api_url="your_api_url",
                model_name="model_name",
                max_workers=5
        )
```

You can predefine storage parameters for operators in the following way:

```python
from dataflow.utils.storage import FileStorage

 self.storage = FileStorage(
            first_entry_file_name="your_file_path",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl", # jsonl, json, ...
        )
```

The `api_llm_serving` and `self.storage` used in the following text are the interface objects defined here. Complete usage examples can be found in `test/test_reasoning.py`.

For parameter passing, the constructor of operator objects mainly passes information related to operator configuration, which can be configured once and called multiple times; while the `X.run()` function passes `key` information related to IO. Details can be seen in the operator description examples below.

## Detailed Operator Descriptions


### 1. ReasoningAnswerGenerator✨

**Function Description:** This operator is specifically designed to generate standard answers for mathematical problems through large language model calls for step-by-step reasoning and precise computation.

**Input Parameters:**

- `__init__()`
  - `llm_serving`: Large language model interface object to use (default: predefined value above)
  - `prompt_template`: Prompt template object for generating questions (e.g., `GeneralAnswerGeneratorPrompt()`)
- `run()`
  - `storage`: Storage interface object (default: predefined value above)
  - `input_key`: Input question field name (default: "question")
  - `output_key`: Output answer field name (default: "generated_answer")

**Key Features:**

- Supports multiple types of mathematical problems (algebra, geometry, probability and statistics, etc.)
- Employs Chain-of-Thought reasoning methodology
- Automatically generates detailed solution steps
- Supports multi-round reasoning and verification

**Usage Example:**

```python
from dataflow.prompts.reasoning.general import GeneralAnswerGeneratorPrompt

answer_gen = ReasoningAnswerGenerator(
          llm_serving=api_llm_serving,
          prompt_template=GeneralAnswerGeneratorPrompt()
          )
result = answer_gen.run(
          storage=self.storage.step(),
          input_key="question",
          output_key="generated_answer"
          )
```

### 2. ReasoningPseudoAnswerGenerator✨

**Function Description:** This operator generates multiple candidate answers and uses statistical methods to select the optimal solution, achieving high-quality pseudo answer generation.

**Input Parameters:**

* `__init__()`
  * `llm_serving`: LLMServingABC instance used to generate candidate answers (default: None)
  * `max_times`: Maximum number of generation rounds to perform (default: 3)
* `run()`

  * `storage`: DataFlowStorage interface for reading the input DataFrame and writing the output
  * `input_key`: Name of the column in the DataFrame containing the input questions (default: "instruction")
  * `output_key_answer`: Name of the column to store the list of all generated answers per row (default: "pseudo_answers")
  * `output_key_answer_value`: Name of the column to store the final selected answer value per row (default: "pseudo_answer_value")
  * `output_key_solutions`: Name of the column to store all solution texts that match the selected answer (default: "pseudo_solutions")
  * `output_key_correct_solution_example`: Name of the column to store a single example solution text (default: "pseudo_correct_solution_example")

**Key Features:**

* Configurable multi-round answer generation (`max_times`)
* Cleans and extracts answers via `StringCleaner`, `UnitTextManager` and `AnswerExtractor`
* Selects final answer by frequency counting with `collections.Counter`
* Logs progress at each generation round and filters out rows without a valid answer
* Returns a list of the four output column keys for downstream processing

**Usage Example:**

```python
from dataflow.prompts.reasoning import AnswerGeneratorPrompt
from dataflow.core import LLMServingABC
from dataflow.utils.storage import DataFlowStorage

# Prepare LLM serving and storage
api_llm_serving = YourLLMServingImplementation()
storage = DataFlowStorage(...)

# Instantiate the pseudo-answer generator
pseudo_gen = ReasoningPseudoAnswerGenerator(
    llm_serving=api_llm_serving,
    max_times=5
)

# Run it on a DataFrame stored in 'storage'
result_keys = pseudo_gen.run(
    storage=storage,
    input_key="instruction",
    output_key_answer="pseudo_answers",
    output_key_answer_value="pseudo_answer_value",
    output_key_solutions="pseudo_solutions",
    output_key_correct_solution_example="pseudo_correct_solution_example",
)

print("Generated columns:", result_keys)
```


### 3. ReasoningQuestionGenerator✨🚀

**Function Description:** This operator can generate new related questions based on existing problems, supporting multiple generation strategies and difficulty control.

**Input Parameters:**

- `__init__()`
  - `llm_serving`: Large language model interface object to use (default: predefined value above)
  - `num_prompts`: Number of new questions to generate per problem (default: 3)
  - `prompt_template`: Prompt template object for generating questions (e.g., `GeneralQuestionSynthesisPrompt()`)
- `run()`
  - `storage`: Storage interface object (default: predefined value above)
  - `input_key`: Input original question field name (default: "source_question")
  - `output_key`: Output new question field name (default: "generated_question")

**Key Features:**

- Diversified question generation strategies
- Automatic difficulty level adjustment
- Knowledge point coverage optimization
- Language expression diversity

**Usage Example:**

```python
from dataflow.prompts.reasoning.general import GeneralQuestionSynthesisPrompt

question_gen = ReasoningQuestionGenerator(
                num_prompts=3,  # from 1 to k
                llm_serving=api_llm_serving,
                prompt_template=GeneralQuestionSynthesisPrompt()
                )
result = question_gen.run(
          storage=self.storage.step(),
          input_key="source_question",
          output_key="generated_question"
          )
```

### 4. ReasoningPretrainFormatConvertGenerator✨

**Function Description:** This operator is used to convert SFT (Supervised Fine-Tuning) format data to pretraining format, supporting custom input-output key configuration, suitable for pretraining data preparation for various generative models.

**Input Parameters:**

- `__init__()`
  - `read_key_question`: Question field name (default: "question")
  - `read_key_answer`: Answer field name (default: "answer")
  - `output_key`: Output field name (default: "text")
- `run()`
  - `storage`: Storage interface object (default: predefined value above)

**Key Features:**

- Supports multiple format conversion rules
- Custom input-output key mapping
- Batch processing optimization
- Compatible with mainstream pretraining data formats

**Usage Example:**

```python
format_converter = ReasoningPretrainFormatConvertGenerator(
    read_key_question="question",
    read_key_answer="answer",
    output_key="text"
)
result = format_converter.run(storage=self.storage.step())
```

### 5. ReasoningQuestionCategorySampleEvaluator✨🚀

**Function Description:**  
This operator is used to perform multi-level classification (main category and subcategory) of user questions. Through large language model semantic analysis of input questions, it outputs standardized classification codes for convenient use by downstream tasks.

**Input Parameters:**

- `__init__()`
  - `llm_serving`: Large language model interface object to use (default: predefined value above)
- `run()`
  - `storage`: Data storage interface object (default: predefined value above)
  - `input_key`: Input question field name (default: "instruction")
  - `output_key`: Output classification result field name (default: "question_category")

**Key Features:**

- Automatic extraction and standardization of main and subcategories
- Automatic cleaning of abnormal JSON and non-ASCII characters
- Diversified prompt reorganization to enhance classification robustness
- Detailed logging for tracking abnormal data

**Usage Example:**

```python
classifier = ReasoningQuestionCategorySampleEvaluator(llm_serving=api_llm_serving)
result_cols = classifier.run(
    storage=self.storage.step(),
    input_key="instruction",
    output_key="question_category"
)
```

### 6. ReasoningQuestionDifficultySampleEvaluator✨

**Function Description:**  
This operator is used to evaluate the difficulty level of questions. Through large language model complexity analysis of questions, it outputs numerical difficulty scores from 1-10 levels.

**Input Parameters:**

- `__init__()`
  - `llm_serving`: Large language model interface object to use (default: predefined value above)
- `run()`
  - `storage`: Data storage interface object (default: predefined value above)
  - `input_key`: Input question field name (default: "instruction")
  - `output_key`: Output difficulty score field name (default: "difficulty_score")

**Key Features:**

- Automatic generation of evaluation prompts
- Parsing of `Rating: x` score values from LLM output
- Logging of parsing exceptions and original strings
- Adaptation to standard data storage and batch output

**Usage Example:**

```python
difficulty = ReasoningQuestionDifficultySampleEvaluator(llm_serving=api_llm_serving)
result_cols = difficulty.run(
    storage=self.storage.step(),
    input_key="instruction",
    output_key="difficulty_score"
)
```

### 7. ReasoningAnswerFormatterFilter

**Function Description:** This operator is specifically designed to check the format compliance of mathematical answers, ensuring answers conform to standard mathematical representation formats.

**Input Parameters:**

- `run()` 
  - `storage`: Storage interface object (default: predefined value above)
  - `input_key`: Input answer field name (default: "generated_cot")

**Key Features:**

- Checks \\boxed{} notation format
- Verifies mathematical symbol correctness
- Supports multiple mathematical representation formats
- Automatic format correction suggestions

**Usage Example:**

```python
filter_op = ReasoningAnswerFormatterFilter()
result = filter_op.run(
          storage=self.storage.step(),
          input_key="generated_cot"
          ) 
```

### 8. ReasoningAnswerGroundTruthFilter✨

**Function Description:** This operator compares predicted answers with ground truth answers, supporting multiple comparison strategies.

**Input Parameters:**

- `__init__()`
  - `compare_method`: Comparison method ("exact" or "math_verify")
- `run()` 
  - `storage`: Storage interface object (default: predefined value above)
  - `test_answer_key`: Predicted answer field name (default: "generated_cot")
  - `gt_answer_key`: Ground truth answer field name (default: "golden_answer")

**Key Features:**

- Exact string matching
- Mathematical equivalence verification
- Numerical tolerance handling
- Symbolic comparison

**Usage Example:**

```python
filter_op = ReasoningAnswerGroundTruthFilter(compare_method="math_verify")
result = filter_op.run(
          storage=self.storage.step(), 
          test_answer_key="generated_cot",
          gt_answer_key="golden_answer"
          )
```

### 9. ReasoningAnswerJudgeMathVerifyFilter✨

**Function Description:** This operator verifies mathematical answer correctness through advanced symbolic computation, supporting equivalence judgment of complex mathematical expressions.

**Input Parameters:**

- `run()` 
  - `storage`: Storage interface object (default: predefined value above)
  - `answer_key`: Answer field name to be verified (default: "student_answer")
  - `gt_key`: Ground truth answer field name (default: "correct_answer")

**Key Features:**

- Symbolic expression parsing
- Mathematical equivalence verification
- Numerical precision control
- Support for various mathematical functions

**Usage Example:**

```python
judger_op = ReasoningAnswerJudgeMathVerifyFilter()
result = judger_op.run(
          storage=self.storage.step(),
          answer_key="student_answer",
          gt_key="correct_answer"
          )
```

### 10. ReasoningAnswerNgramFilter✨

**Function Description:** This operator detects repetitive patterns in answers based on n-gram statistical analysis, filtering low-quality repetitive content.

**Input Parameters:**

- `__init__()`
  - `min_score`: Minimum acceptable score (default: 0.1)
  - `max_score`: Maximum acceptable score (default: 1.0)
  - `ngrams`: N-gram size (default: 5)
- `run()` 
  - `storage`: Storage interface object (default: predefined value above)
  - `question_key`: Question field name (default: "instruction")
  - `answer_key`: Answer field name (default: "generated_cot")

**Key Features:**

- N-gram repetition rate calculation
- Configurable threshold ranges
- Text preprocessing and cleaning
- Statistical analysis reporting

**Usage Example:**

```python
ngram_filter = ReasoningAnswerNgramFilter(
                min_score=0.1,
                max_score=1.0,
                ngrams=5
                )
result = ngram_filter.run(
          storage=self.storage.step(),
          question_key="instruction",
          answer_key="generated_cot"
          )
```

### 11. ReasoningAnswerPipelineRootFilter✨

**Function Description:** Root node operator of the answer processing pipeline, responsible for intelligently distributing data to different processing branches.

**Input Parameters:**

- `run()` 
  - `storage`: Storage interface object (default: predefined value above)
  - `input_answer_key`: Input answer field name (default: "output")
  - `input_gt_key`: Input ground truth answer field name (default: "golden_answer")

**Key Features:**

- Intelligent data distribution
- Processing branches for with/without ground truth
- Answer extraction and cleaning
- Process state management

**Usage Example:**

```python
root_op = ReasoningAnswerPipelineRootFilter()
result = root_op.run(
          storage=self.storage.step(),
          input_answer_key="output",
          input_gt_key="golden_answer"
          )
```

### 12. ReasoningAnswerTokenLengthFilter

**Function Description:** This operator controls answer length based on token count, filtering answers that are too long or too short.

**Input Parameters:**

- `__init__()`
  - `max_answer_token_length`: Maximum token count (default: 8192)
  - `tokenizer_dir`: Tokenizer path (default: "Qwen/Qwen2.5-0.5B-Instruct")
- `run()` 
  - `storage`: Storage interface object (default: predefined value above)
  - `input_key`: Input field name (default: "generated_cot")

**Key Features:**

- Precise token counting
- Configurable tokenizer
- Batch processing optimization
- Length statistics reporting

**Usage Example:**

```python
length_filter = ReasoningAnswerTokenLengthFilter(
                  max_answer_token_length=8192,
                  tokenizer_dir="Qwen/Qwen2.5-0.5B-Instruct"
                  )
result = length_filter.run(
          storage=self.storage.step(),
          input_key="generated_cot"
          )
```

### 13. ReasoningQuestionFilter✨🚀

**Function Description:** This operator performs comprehensive quality checks on mathematical problems, ensuring problem correctness and solvability.

**Input Parameters:**

- `__init__()`
  - `llm_serving`: Large language model interface object to use (default: predefined value above)
  - `system_prompt`: System prompt
  - `prompt_template`: Prompt template object for generating questions (e.g., `GeneralQuestionFilterPrompt()`)
- `run()` 
  - `storage`: Storage interface object (default: predefined value above)
  - `input_key`: Input question field name (default: "math_problem")

**Key Features:**

- Four-stage quality checking
- Format compliance verification
- Semantic reasonableness analysis
- Logical consistency checking
- Solvability assessment

**Check Dimensions:**

1. **Format Check**: Verifies if problem statement is standardized
2. **Semantic Check**: Analyzes if problem has clear meaning
3. **Logic Check**: Checks for contradictory conditions
4. **Solvability Check**: Evaluates if sufficient information is available

**Usage Example:**

```python
from dataflow.prompts.reasoning.general import GeneralQuestionFilterPrompt

question_filter = ReasoningQuestionFilter(
    llm_serving=api_llm_serving,
    system_prompt="You are a math problem validator.",
    prompt_template=GeneralQuestionFilterPrompt()
    )
result = question_filter.run(
          storage=self.storage.step(),
          input_key="math_problem"
          )
```

