---

title: 强推理数据合成流水线
icon: mdi:brain
createTime: 2025/06/16 13:08:42
permalink: /zh/guide/reasoningpipeline/

---

# 强推理数据合成流水线

## 1. 概述

**强推理数据合成流水线**的核心目标是通过数学问答数据的合成与处理，扩展现有数据集的规模和多样性，从而为模型调优提供更加丰富的训练数据。流水线包含多个处理步骤（如问题过滤、问题合成、答案生成与验证等），将原始数学问题数据转化为高质量的问答数据，进一步对生成的数据进行分类、难度评分和去重，最终形成适用于各种推理任务的高质量数据集。

我们支持以下应用场景：

* 强推理指令微调数据的高质量合成
* 大规模数学预训练数据的生成

流水线的主要流程包括：

1. **问题处理**：过滤非数学问题、合成新问题、验证问题正确性、进行难度评分和类别分类。
2. **答案生成与处理**：根据问题的标准答案或模型生成的答案进行处理，包括格式过滤、长度过滤和正确性验证等。
3. **数据去重**：对生成的问答数据进行去重，确保数据集的质量。

## 2. 数据流与流水线逻辑

### 1. **输入数据**

流水线的输入数据主要包括以下字段：

* **instruction**：问题文本，通常为数学问题或任务描述。
* **golden\_answer**：标准答案（如果存在），适用于包含标准答案的数据集。
* **solution**：已知的解答或推理过程（如果存在）。

这些输入数据可以存储在指定的文件（如`json`、`jsonl`）中，并通过`FileStorage`对象进行管理和读取。示例中会载入默认的数据路径，实际使用场景下可以根据需求修改路径以载入自定义的数据和缓存路径：

```python
self.storage = FileStorage(
    first_entry_file_name="../dataflow/example/ReasoningPipeline/pipeline_math_short.json",
    cache_path="./cache_local",
    file_name_prefix="dataflow_cache_step",
    cache_type="jsonl",
)
```

### 2. **问题处理（Question Handling）**

#### 2.1 **问题过滤（ReasoningQuestionFilter）**

流水线的第一步是通过**问题过滤器**（`ReasoningQuestionFilter`）剔除无效的数学问题。此步骤至关重要，它确保进入后续步骤的问题为有效的数学问题，避免无关或错误的问题影响后续数据合成。

**功能：**

* 去除非数学类问题（如自然语言问题、非数学问题等）。
* 保证模型只处理有效的数学问题。

**输入**：原始数学问题
**输出**：经过清洗的有效数学问题

```python
question_filter = ReasoningQuestionFilter(
    llm_serving=api_llm_serving,
    system_prompt="You are a math problem validator."
    )
```

#### 2.2 **问题合成（ReasoningQuestionGenerator）**

在问题通过过滤后，**问题合成**（`ReasoningQuestionGenerator`）步骤基于已有的问题生成新的数学问题，以增强数据集的多样性和规模。

**功能：**

* 基于现有问题生成新的变种或类似问题。
* 增强数据集，提升模型的泛化能力。

**输入**：经过过滤的有效问题
**输出**：合成的新问题

```python
question_gen = ReasoningQuestionGenerator(
                num_prompts=3,  # from 1 to k
                llm_serving=api_llm_serving
                )
```

#### 2.3 **问题过滤（ReasoningQuestionFilter）**

生成的新问题会再次经过**问题过滤**步骤，确保其有效性。这一步确保生成的问题符合数学推理标准，过滤掉不符合条件的合成问题。

**功能：**

* 再次验证问题的有效性。
* 过滤掉不合格的合成问题。

**输入**：合成的新问题
**输出**：有效的合成问题

```python
question_filter = ReasoningQuestionFilter(
    llm_serving=api_llm_serving,
    system_prompt="You are a math problem validator."
    )
```

#### 2.4 **问题难度分类（ReasoningQuestionDifficultySampleEvaluator）**

**问题难度分类**（`ReasoningQuestionDifficultySampleEvaluator`）对合成后的问题进行难度评分。此步骤将问题按难度等级进行分类，有助于后续数据分析和模型调优。

**功能：**

* 为每个问题分配难度评分（0-10分）。
* 提供问题的难度标签，以便后续分析。

**输入**：有效的合成问题
**输出**：每个问题的难度评分

```python
difficulty = ReasoningQuestionDifficultySampleEvaluator(llm_serving=api_llm_serving)
```

#### 2.5 **问题类别分类（ReasoningQuestionCategorySampleEvaluator）**

**问题类别分类**（`ReasoningQuestionCategorySampleEvaluator`）将问题按数学类别（如代数、几何、概率等）进行分类。此步骤有助于后续分析问题的分布和多样性。

**功能：**

* 将问题分为不同的数学类别（例如几何、组合数学等）。
* 便于后续的分析和分组处理。

**输入**：有效的合成问题
**输出**：问题的类别标签

```python
classifier = ReasoningQuestionCategorySampleEvaluator(llm_serving=api_llm_serving)
```

### 3. **答案处理（Answer Handling）**

#### 3.1 **答案分支（ReasoningAnswerPipelineRootFilter）**

在问题处理后，流水线进入答案生成部分。如果数据中包含标准答案（`golden_answer`），数据流会进入一个处理分支；否则，将进入伪答案生成路径。

**功能：**

* 决定是否使用标准答案或生成伪答案。
* 如果有标准答案，则生成与其相关的推理过程；如果没有，则通过模型生成伪答案。

**输入**：问题的输出（以及标准答案，如果有）
**输出**：标准答案分支或伪答案分支

```python
branch = ReasoningAnswerPipelineRootFilter()
```

#### 3.2 **答案生成（ReasoningAnswerGenerator）**

对于包含标准答案的情况，**答案生成**（`ReasoningAnswerGenerator`）步骤会生成带有推理过程的答案，提供长链推理的过程，以增加答案的可靠性和透明度。对于不包含标准答案的情况，此步骤为**伪答案生成**（PseudoReasoningAnswerGenerator），通过要求模型多次回答同一个问题，投票选出频率最高的答案，作为**伪答案**。

**功能：**

* 根据问题和标准答案生成详细的推理过程。
* 确保答案透明且可解释。

**输入**：问题文本（以及标准答案）
**输出**：含标准答案：模型生成的推理过程（长链推理）；不含标准答案：伪答案和长链推理过程。

```python
answer_gen = ReasoningAnswerGenerator(llm_serving=api_llm_serving)
```

#### 3.3 **答案格式过滤（ReasoningAnswerFormatterFilter）**

生成的答案会经过**答案格式过滤**（`ReasoningAnswerFormatterFilter`）步骤，确保其符合预设格式要求。这一步骤保证了生成的答案结构化且有效，避免不符合格式的答案影响后续处理。

**功能：**

* 确保答案格式符合要求。

**输入**：生成的答案（长链推理）
**输出**：符合格式要求的答案

```python
filter_op = ReasoningAnswerFormatterFilter()
```

#### 3.4 **答案长度过滤（ReasoningAnswerTokenLengthFilter）**

接下来，**答案长度过滤**（`ReasoningAnswerTokenLengthFilter`）步骤会根据预设的最大答案长度进行过滤，剔除过长或过短的答案，确保生成的答案长度适当。

**功能：**

* 过滤掉过长或过短的答案，确保答案长度在合理范围内。

**输入**：生成的答案
**输出**：符合长度要求的答案

```python
length_filter = ReasoningAnswerTokenLengthFilter(
                  max_answer_token_length=8192,
                  tokenizer_dir="Qwen/Qwen2.5-0.5B-Instruct"
                  )
```

#### 3.5 **答案验证与去重（ReasoningAnswerGroundTruthFilter, ReasoningAnswerNgramFilter）**

最后，生成的答案会经过**答案验证**（`ReasoningAnswerGroundTruthFilter`）和**答案去重**（`ReasoningAnswerNgramFilter`）步骤：

* **答案验证**：通过与标准答案进行对比，验证答案的准确性。
* **答案去重**：使用N-gram算法去除重复的答案，确保每个问题的答案唯一且不重复。

**功能：**

* 验证答案的准确性。
* 去重，确保答案的唯一性。

**输入**：生成的答案
**输出**：经过验证和去重的答案

```python
filter_op = ReasoningAnswerGroundTruthFilter(compare_method="math_verify")
ngram_filter = ReasoningAnswerNgramFilter(
                min_score=0.1,
                max_score=1.0,
                ngrams=5
                )
```

### 4. **输出数据**

最终，流水线生成的输出数据将包含以下内容：

* **instruction**：问题文本
* **generated\_cot**：模型生成的长链推理过程
* **output**：模型生成的最终答案
* **golden\_answer**：标准答案（如果有）
* **Synth\_or\_Input**：标记数据来源，`input`表示原始数据，`synth`表示流水线合成的数据
* **Difficulty**：问题的难度评分（0–10）
* **primary\_category**：问题的主要类别
* **secondary\_category**：问题的次要类别

## 3. 运行方式

该流水线通过简单的Python命令执行不同的配置，满足不同的数据需求：

* **强推理指令微调数据合成**：

  ```bash
  python test/test_reasoning.py
  ```

* **大规模预训练数据合成**：

  ```bash
  python test/test_reasoning_pretrain.py
  ```

## 4. 流水线示例
以下给出示例流水线，演示如何使用多个算子进行推理数据处理。该示例展示了如何初始化一个推理数据处理流水线，并且顺序执行各个过滤和清理步骤。

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

