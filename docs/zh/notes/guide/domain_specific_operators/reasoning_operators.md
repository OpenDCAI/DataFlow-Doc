---
title: 强推理算子
createTime: 2025/06/24 11:43:42
permalink: /zh/guide/Reasoning_operators/
---

# 强推理算子

## 概述

强推理算子是专门用于数学推理和问题求解的算子集合，主要分为三大类：**数据生成算子（Generator）** 、**过滤算子（Filter）**和**改写算子（Refiner）**。这些算子能够处理复杂的数学推理任务，包括答案生成、验证、过滤和格式化等功能，同时支持多种数学表示格式。

开源的算子种类是十分受限的，为了获得更好的数据处理质量，填补开源缺失的数据合成与处理方法，我们精心设计并**自研**了新的算子集，其标记含义如下：

- 🚀 **自主创新**：核心算法原创研发，填补现有算法空白或是进一步提升性能，突破当下性能瓶颈。
- ✨ **开源首发**：首次将该算子集成到社区主流框架中，方便更多开发者使用，实现开源共享。


## 数据生成算子

数据生成器主要负责生成各类推理相关的数据，包括答案生成、问题生成等。

<table class="tg">
  <thead>
    <tr>
      <th class="tg-0pky">名称</th>
      <th class="tg-0pky">适用类型</th>
      <th class="tg-0pky">简介</th>
      <th class="tg-0pky">官方仓库或论文</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="tg-0pky">ReasoningAnswerGenerator✨</td>
      <td class="tg-0pky">答案合成</td>
      <td class="tg-0pky">该算子用于生成数学问题的标准答案，调用大语言模型进行分步推理和计算。</td>
      <td class="tg-0pky"><a href="https://arxiv.org/abs/2410.01560">Paper</a></td>
    </tr>
    <tr>
      <td class="tg-0pky">ReasoningPseudoAnswerGenerator✨</td>
      <td class="tg-0pky">伪答案生成与投票</td>
      <td class="tg-0pky">该算子生成多个候选答案并通过统计选择最优解，实现伪答案生成。</td>
      <td class="tg-0pky"><a href="https://arxiv.org/abs/2410.01560">Paper</a></td>
    </tr>
    <tr>
      <td class="tg-0pky">ReasoningQuestionGenerator✨🚀</td>
      <td class="tg-0pky">问题生成</td>
      <td class="tg-0pky">该算子用于基于现有问题生成新问题，支持多种生成策略以保证多样性。</td>
      <td class="tg-0pky">-</td>
    </tr>
    <tr>
      <td class="tg-0pky">ReasoningPretrainFormatConvertGenerator✨</td>
      <td class="tg-0pky">格式转换</td>
      <td class="tg-0pky">将SFT格式数据转换为预训练格式，支持自定义输入输出键配置</td>
      <td class="tg-0pky">-</td>
    </tr>
    <tr>
      <td class="tg-0pky">ReasoningQuestionCategorySampleEvaluator✨🚀</td>
      <td class="tg-0pky">问题分类</td>
      <td class="tg-0pky">对用户问题进行多级分类，依据设计并改进后的MSC数学分类标准</td>
      <td class="tg-0pky">-</td>
    </tr>
    <tr>
      <td class="tg-0pky">ReasoningQuestionDifficultySampleEvaluator✨</td>
      <td class="tg-0pky">难度评估</td>
      <td class="tg-0pky">评估问题难度等级，输出1-10级细粒度难度评分</td>
      <td class="tg-0pky"><a href="https://arxiv.org/abs/2410.07985">Paper</a></td>
    </tr>
    <tr>
      <td class="tg-0pky">ReasoningAnswerExtractionQwenMathEvalGenerator✨</td>
      <td class="tg-0pky">答案提取与标准化</td>
      <td class="tg-0pky">从数学问题回答中提取规范化答案表达式，支持单位处理和格式转换</td>
      <td class="tg-0pky"><a href="https://github.com/QwenLM/Qwen2.5-Math">Code</a></td>
    </tr>
  </tbody>
</table>


## 处理算子

处理算子主要负责对生成的数据进行处理、验证、过滤和格式化等操作。

<table class="tg">
  <thead>
    <tr>
      <th class="tg-0pky">名称</th>
      <th class="tg-0pky">适用类型</th>
      <th class="tg-0pky">简介</th>
      <th class="tg-0pky">官方仓库或论文</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="tg-0pky">ReasoningAnswerFormatterFilter</td>
      <td class="tg-0pky">格式验证</td>
      <td class="tg-0pky">该算子用于检查答案格式是否符合规范，主要验证数学答案是否包含正确的\\boxed{}标记。</td>
      <td class="tg-0pky">-</td>
    </tr>
    <tr>
      <td class="tg-0pky">ReasoningAnswerGroundTruthFilter✨</td>
      <td class="tg-0pky">标准答案匹配</td>
      <td class="tg-0pky">该算子用于对比预测答案与标准答案的匹配度，支持精确匹配和数学验证两种方式。</td>
      <td class="tg-0pky">-</td>
    </tr>
    <tr>
      <td class="tg-0pky">ReasoningAnswerJudgeMathVerifyFilter✨</td>
      <td class="tg-0pky">数学答案验证</td>
      <td class="tg-0pky">该算子通过符号计算验证答案正确性，执行数学表达式解析和等价性验证。</td>
      <td class="tg-0pky"><a href="https://github.com/huggingface/Math-Verify">Code</a></td>
    </tr>
    <tr>
      <td class="tg-0pky">ReasoningAnswerNgramFilter✨</td>
      <td class="tg-0pky">重复检测</td>
      <td class="tg-0pky">该算子基于n-gram重复率过滤答案，检测回答中的重复模式和冗余内容。</td>
      <td class="tg-0pky"><a href="https://en.wikipedia.org/wiki/N-gram">Wiki</a></td>
    </tr>
    <tr>
      <td class="tg-0pky">ReasoningAnswerPipelineRootFilter✨</td>
      <td class="tg-0pky">标准答案存在性分类器</td>
      <td class="tg-0pky">答案处理流程根节点，负责将输入数据根据有无真实标签GT分发到不同处理分支。</td>
      <td class="tg-0pky">-</td>
    </tr>
    <tr>
      <td class="tg-0pky">ReasoningAnswerTokenLengthFilter</td>
      <td class="tg-0pky">长度控制</td>
      <td class="tg-0pky">该算子根据token数量过滤过长的答案，确保答案长度在合理范围内。</td>
      <td class="tg-0pky">-</td>
    </tr>
    <tr>
      <td class="tg-0pky">ReasoningQuestionFilter✨🚀</td>
      <td class="tg-0pky">问题验证</td>
      <td class="tg-0pky">该算子用于对数学问题进行正确性检查，包括格式规范、语义合理性、条件一致性等。</td>
      <td class="tg-0pky"><a href="https://github.com/scuuy/MathQ-Verify">Code</a></td>
    </tr>
  </tbody>
</table>


## 算子接口调用说明

特别地，对于指定存储路径等或是调用模型的算子，我们提供了封装后的**模型接口**以及**存储对象接口**，可以通过以下方式为算子进行模型API参数预定义：

```python
from dataflow.llmserving import APILLMServing_request

api_llm_serving = APILLMServing_request(
                api_url="your_api_url",
                model_name="model_name",
                max_workers=5
        )
```
可以通过以下方式为算子进行存储参数预定义：

```python
from dataflow.utils.storage import FileStorage

 self.storage = FileStorage(
            first_entry_file_name="your_file_path",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl", # jsonl, json, ...
        )
```

后文使用的`api_llm_serving`以及`self.storage`即为此处已定义的接口对象，完整调用示例可参考`test/test_reasoning.py`。

对于传参，算子对象的构造函数主要传递与算子配置相关的信息，配置后可以一配置多调用；而`X.run()`函数传递与IO相关的`key`信息，详细可见后文算子说明示例。

## 详细算子说明

### 1. ReasoningAnswerGenerator✨

**功能描述：** 该算子专门用于生成数学问题的标准答案，通过调用大语言模型进行分步推理和精确计算。

**输入参数：**

- `__init__()`
  - `llm_serving`：使用的大语言模型接口对象（默认：前文预设值）
  - `prompt_template`：生成问题的提示模板对象（例如`GeneralAnswerGeneratorPrompt()`）
- `run()`
  - `storage`：存储接口对象（默认：前文预设值）
  - `input_key`：输入问题字段名（默认："question"）
  - `output_key`：输出答案字段名（默认："generated_answer"）

**主要特性：**

- 支持多种数学问题类型（代数、几何、概率统计等）
- 采用链式思维（Chain-of-Thought）推理方法
- 自动生成详细的解题步骤
- 支持多轮推理和验证

**使用示例：**

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

**功能描述：** 该算子通过生成多个候选答案并使用统计方法选择最优解，实现高质量的伪答案生成。

**输入参数：**

* `__init__()`

  * `llm_serving`：用于生成候选答案的 LLMServingABC 实例（默认值：None）
  * `max_times`：执行生成轮次的最大次数（默认值：3）
* `run()`

  * `storage`：用于读取输入 DataFrame 并写入输出的 DataFlowStorage 接口
  * `input_key`：DataFrame 中包含输入问题的列名（默认值："instruction"）
  * `output_key_answer`：用于存储每行所有生成答案列表的列名（默认值："pseudo_answers"）
  * `output_key_answer_value`：用于存储每行最终选择的答案值的列名（默认值："pseudo_answer_value"）
  * `output_key_solutions`：用于存储所有与所选答案匹配的解决方案文本的列名（默认值："pseudo_solutions"）
  * `output_key_correct_solution_example`：用于存储单个示例解决方案文本的列名（默认值："pseudo_correct_solution_example"）

**主要功能：**

* 可配置的多轮答案生成（`max_times`）
* 通过 `StringCleaner`、`UnitTextManager` 和 `AnswerExtractor` 清洗并提取答案
* 使用 `collections.Counter` 按频次计数选择最终答案
* 记录每轮生成进度并过滤掉无效答案的行
* 返回四个输出列键的列表以供后续处理

**使用示例：**

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

**功能描述：** 该算子能够基于现有问题生成新的相关问题，支持多种生成策略和难度控制。

**输入参数：**

- `__init__()`
  - `llm_serving`：使用的大语言模型接口对象（默认：前文预设值）
  - `num_prompts`：每个问题生成新问题数量（默认：3）
  - `prompt_template`：生成问题的提示模板对象（例如`GeneralQuestionSynthesisPrompt()`）
- `run()`
  - `storage`：存储接口对象（默认：前文预设值）
  - `input_key`：输入原始问题字段名（默认："source_question"）
  - `output_key`：输出新问题字段名（默认："generated_question"）

**主要特性：**

- 多样化问题生成策略
- 难度级别自动调节
- 知识点覆盖优化
- 语言表达多样性

**使用示例：**

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

**功能描述：** 该算子用于将SFT（监督微调）格式数据转换为预训练格式，支持自定义输入输出键配置，适用于各类生成式模型的预训练数据准备。

**输入参数：**
- `__init__()`
  - `read_key_question`：问题字段名（默认："question"）
  - `read_key_answer`：答案字段名（默认："answer"）
  - `output_key`：输出字段名（默认："text"）
- `run()`
  - `storage`：存储接口对象（默认：前文预设值）

**主要特性：**
- 支持多种格式转换规则
- 自定义输入输出键映射
- 批量处理优化
- 兼容主流预训练数据格式

**使用示例：**
```python
format_converter = ReasoningPretrainFormatConvertGenerator(
    read_key_question="question",
    read_key_answer="answer",
    output_key="text"
)
result = format_converter.run(storage=self.storage.step())
```

### 5. ReasoningQuestionCategorySampleEvaluator✨🚀

**功能描述：**  
该算子用于对用户问题进行多级分类（主分类和子分类）。通过大语言模型对输入问题进行语义分析，输出标准化后的分类编码，便于下游任务使用。

**输入参数：**

- `__init__()`
  - `llm_serving`：使用的大语言模型接口对象（默认：前文预设值）
- `run()`
  - `storage`：数据存储接口对象（默认：前文预设值）
  - `input_key`：输入问题字段名（默认："instruction"）
  - `output_key`：输出分类结果字段名（默认："question_category"）

**主要特性：**

- 主分类与子分类自动提取与标准化
- 自动清理异常 JSON 与非 ASCII 字符
- 多样化 Prompt 重组以增强分类稳健性
- 日志详细追踪异常数据

**使用示例：**

```python
classifier = ReasoningQuestionCategorySampleEvaluator(llm_serving=api_llm_serving)
result_cols = classifier.run(
    storage=self.storage.step(),
    input_key="instruction",
    output_key="question_category"
)
```

### 6. ReasoningQuestionDifficultySampleEvaluator✨

**功能描述：**  
该算子用于评估问题的难度等级，通过大语言模型对问题进行复杂度分析，输出 1-10 级的数值型难度评分。

**输入参数：**

- `__init__()`
  - `llm_serving`：使用的大语言模型接口对象（默认：前文预设值）
- `run()`
  - `storage`：数据存储接口对象（默认：前文预设值）
  - `input_key`：输入问题字段名（默认："instruction"）
  - `output_key`：输出难度评分字段名（默认："difficulty_score"）

**主要特性：**

- 自动生成评估 Prompt
- 从 LLM 输出中解析 `Rating: x` 的评分值
- 日志记录解析异常与原始字符串
- 适配标准数据存储与批量写出

**使用示例：**

```python
difficulty = ReasoningQuestionDifficultySampleEvaluator(llm_serving=api_llm_serving)
result_cols = difficulty.run(
    storage=self.storage.step(),
    input_key="instruction",
    output_key="difficulty_score"
)
```

### 7. ReasoningAnswerFormatterFilter

**功能描述：** 该算子专门用于检查数学答案的格式规范性，确保答案符合标准的数学表示格式。

**输入参数：**

- `run()` 
  - `storage`：存储接口对象（默认：前文预设值）
  - `input_key`：输入答案字段名（默认："generated_cot"）

**主要特性：**

- 检查\\boxed{}标记格式
- 验证数学符号正确性
- 支持多种数学表示格式
- 自动格式修正建议

**使用示例：**

```python
filter_op = ReasoningAnswerFormatterFilter()
result = filter_op.run(
          storage=self.storage.step(),
          input_key="generated_cot"
          ) 
```

### 8. ReasoningAnswerGroundTruthFilter✨

**功能描述：** 该算子用于对比预测答案与标准答案的匹配度，支持多种比较策略。

**输入参数：**

- `__init__()`
  - `compare_method`：比较方法（"exact" or "math_verify"）
- `run()` 
  - `storage`：存储接口对象（默认：前文预设值）
  - `test_answer_key`：预测答案字段名（默认："generated_cot"）
  - `gt_answer_key`：标准答案字段名（默认："golden_answer"）

**主要特性：**

- 精确字符串匹配
- 数学等价性验证
- 数值容差处理
- 符号化比较

**使用示例：**

```python
filter_op = ReasoningAnswerGroundTruthFilter(compare_method="math_verify")
result = filter_op.run(
          storage=self.storage.step(), 
          test_answer_key="generated_cot",
          gt_answer_key="golden_answer"
          )
```

### 9. ReasoningAnswerJudgeMathVerifyFilter✨

**功能描述：** 该算子通过高级符号计算验证数学答案的正确性，支持复杂数学表达式的等价性判断。

**输入参数：**

- `run()` 
  - `storage`：存储接口对象（默认：前文预设值）
  - `answer_key`：待验证答案字段名（默认："student_answer"）
  - `gt_key`：标准答案字段名（默认："correct_answer"）

**主要特性：**

- 符号表达式解析
- 等价性数学验证
- 数值精度控制
- 多种数学函数支持

**使用示例：**

```python
judger_op = ReasoningAnswerJudgeMathVerifyFilter()
result = judger_op.run(
          storage=self.storage.step(),
          answer_key="student_answer",
          gt_key="correct_answer"
          )
```

### 10. ReasoningAnswerNgramFilter✨

**功能描述：** 该算子基于n-gram统计分析检测答案中的重复模式，过滤低质量的重复内容。

**输入参数：**

- `__init__()`
  - `min_score`：最小可接受分数（默认：0.1）
  - `max_score`：最大可接受分数（默认：1.0）
  - `ngrams`：n-gram大小（默认：5）
- `run()` 
  - `storage`：存储接口对象（默认：前文预设值）
  - `question_key`：问题字段名（默认："instruction"）
  - `answer_key`：答案字段名（默认："generated_cot"）

**主要特性：**

- N-gram重复率计算
- 可配置的阈值范围
- 文本预处理和清理
- 统计分析报告

**使用示例：**

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

**功能描述：** 答案处理流程的根节点算子，负责智能分发数据到不同的处理分支。

**输入参数：**
- `run()` 
  - `storage`：存储接口对象（默认：前文预设值）
  - `input_answer_key`：输入答案字段名（默认："output"）
  - `input_gt_key`：输入标准答案字段名（默认："golden_answer"）

**主要特性：**

- 智能数据分发
- 有/无标准答案分支处理
- 答案提取和清理
- 流程状态管理

**使用示例：**

```python
root_op = ReasoningAnswerPipelineRootFilter()
result = root_op.run(
          storage=self.storage.step(),
          input_answer_key="output",
          input_gt_key="golden_answer"
          )
```

### 12. ReasoningAnswerTokenLengthFilter

**功能描述：** 该算子根据token数量控制答案长度，过滤过长或过短的答案内容。

**输入参数：**

- `__init__()`
  - `max_answer_token_length`：最大token数（默认：8192）
  - `tokenizer_dir`：分词器路径（默认："Qwen/Qwen2.5-0.5B-Instruct"）
- `run()` 
  - `storage`：存储接口对象（默认：前文预设值）
  - `input_key`：输入字段名（默认："generated_cot"）

**主要特性：**

- 精确token计数
- 可配置分词器
- 批量处理优化
- 长度统计报告

**使用示例：**

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

**功能描述：** 该算子对数学问题进行全面的质量检查，确保问题的正确性和可解性。

**输入参数：**

- `__init__()`
  - `llm_serving`：使用的大语言模型接口对象（默认：前文预设值）
  - `system_prompt`：系统提示词
  - `prompt_template`：生成问题的提示模板对象（例如`GeneralQuestionFilterPrompt()`）
- `run()` 
  - `storage`：存储接口对象（默认：前文预设值）
  - `input_key`：输入问题字段名（默认："math_problem"）

**主要特性：**

- 四阶段质量检查
- 格式规范验证
- 语义合理性分析
- 逻辑一致性检查
- 可解性评估

**检查维度：**

1. **格式检查**：验证问题表述是否规范
2. **语义检查**：分析问题是否有明确含义
3. **逻辑检查**：检查条件是否矛盾
4. **可解性检查**：评估是否具备充分信息

**使用示例：**

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

