---
title: Text2SQL算子
createTime: 2025/06/24 11:43:42
permalink: /zh/guide/Text2SQL_operators/
---

# Text2SQL算子

## 概述

Text-to-SQL算子是专门用于Text-to-SQL问题数据处理和质量提升的算子集合，旨在：
- 清洗并扩充现有的Text-to-SQL数据集
- 为每个样本生成包含训练提示词（prompt）和长链推理过程（chain-of-thought）的高质量问答对
- 提供多维度的数据质量评估和难度分级

开源的算子种类是十分受限的，为了获得更好的数据处理质量，填补开源缺失的数据合成与处理方法，我们精心设计并**自研**了新的算子集，其标记含义如下：

- 🚀 **自主创新**：核心算法原创研发，填补现有算法空白或是进一步提升性能，突破当下性能瓶颈。
- ✨ **开源首发**：首次将该算子集成到社区主流框架中，方便更多开发者使用，实现开源共享。

## 数据生成算子

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
      <td class="tg-0pky">SQLGenerator</td>
      <td class="tg-0pky">数据生成</td>
      <td class="tg-0pky">基于数据库Schema生成多样化SQL语句</td>
      <td class="tg-0pky"><a href="https://arxiv.org/abs/2503.02240">OmniSQL</a></td>
    </tr>
    <tr>
      <td class="tg-0pky">SQLVariationGenerator🚀</td>
      <td class="tg-0pky">数据增强</td>
      <td class="tg-0pky">基于SQL语句和数据库Schema生成SQL变体</td>
      <td class="tg-0pky">-</td>
    </tr>
    <tr>
      <td class="tg-0pky">Text2SQLQuestionGenerator</td>
      <td class="tg-0pky">问题生成</td>
      <td class="tg-0pky">基于SQL语句生成对应的自然语言问题</td>
      <td class="tg-0pky"><a href="https://arxiv.org/abs/2503.02240">OmniSQL</a></td>
    </tr>
    <tr>
      <td class="tg-0pky">Text2SQLPromptGenerator✨</td>
      <td class="tg-0pky">提示词生成</td>
      <td class="tg-0pky">构建包含Schema和问题的训练提示词</td>
      <td class="tg-0pky">-</td>
    </tr>
    <tr>
      <td class="tg-0pky">Text2SQLCoTGenerator</td>
      <td class="tg-0pky">推理链生成</td>
      <td class="tg-0pky">生成SQL推理的逐步思维链过程</td>
      <td class="tg-0pky"><a href="https://arxiv.org/abs/2503.02240">OmniSQL</a></td>
    </tr>
    <tr>
      <td class="tg-0pky">Text2SQLCoTVotingGenerator✨</td>
      <td class="tg-0pky">推理链筛选</td>
      <td class="tg-0pky">对候选推理过程进行执行一致性投票，选出最终CoT</td>
      <td class="tg-0pky">-</td>
    </tr>
  </tbody>
</table>

## 数据评估算子

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
      <td class="tg-0pky">SQLComponentClassifier</td>
      <td class="tg-0pky">难度评估</td>
      <td class="tg-0pky">基于SQL语法复杂度进行难度分级</td>
      <td class="tg-0pky"><a href="https://arxiv.org/abs/1809.08887">Spider</a></td>
    </tr>
    <tr>
      <td class="tg-0pky">SQLExecutionClassifier🚀</td>
      <td class="tg-0pky">执行难度评估</td>
      <td class="tg-0pky">基于模型执行成功率进行难度分级</td>
      <td class="tg-0pky">-</td>
    </tr>
  </tbody>
</table>

## 数据过滤算子

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
      <td class="tg-0pky">SQLExecutionFilter✨</td>
      <td class="tg-0pky">数据清洗</td>
      <td class="tg-0pky">过滤无法正常执行的SQL语句</td>
      <td class="tg-0pky">-</td>
    </tr>
    <tr>
      <td class="tg-0pky">SQLExecutabilityFilter✨</td>
      <td class="tg-0pky">数据清洗</td>
      <td class="tg-0pky">使用查询计划过滤不可执行SQL语句</td>
      <td class="tg-0pky">-</td>
    </tr>
    <tr>
      <td class="tg-0pky">Text2SQLCorrespondenceFilter✨</td>
      <td class="tg-0pky">数据清洗</td>
      <td class="tg-0pky">验证SQL与问题描述的语义一致性</td>
      <td class="tg-0pky">-</td>
    </tr>
  </tbody>
</table>

## 算子接口调用说明

特别地，对于指定存储路径等或是调用模型的算子，我们提供了封装后的**模型接口**、**存储对象接口**和**数据库管理接口**，可以通过这些接口，对所需要使用的配置进行预定义。

### 模型接口配置

可以通过以下方式为算子进行模型API参数预定义，包括生成式模型和嵌入模型：

```python
from dataflow.serving import APILLMServing_request

api_llm_serving = APILLMServing_request(
    api_url="your_api_url",        # API服务地址
    model_name="model_name",       # 模型名称
    max_workers=5                  # 最大并发数
)

embedding_serving = APILLMServing_request(
    api_url="http://api.openai.com/v1/embeddings",
    model_name="text-embedding-ada-002",
    max_workers=100
)
```

### 存储接口配置  

可以通过以下方式为算子进行存储参数预定义：

```python
from dataflow.utils.storage import FileStorage

storage = FileStorage(
    first_entry_file_name="your_file_path",           # 初始文件路径
    cache_path="./cache",                             # 缓存目录
    file_name_prefix="dataflow_cache_step",           # 文件名前缀
    cache_type="jsonl",                               # 缓存文件类型
)
```

### 数据库管理接口配置

由于需要使用数据库Schema信息，可以通过以下的方式对数据库管理进行预定义，在算子中，通过与数据库管理器进行交互，实现对数据库信息的读取和管理：

```python
from dataflow.utils.text2sql.database_manager import DatabaseManager

database_manager = DatabaseManager(
    db_type="your_db_type", # 目前支持 SQLite 和 MySQL
    config={
        "your_db_config_key": "your_db_config_value"
    }    
)
```

需要注意的是，对于 SQLite 和 MySQL 数据库，分别需要按照下面的方式来进行配置：

```python
# SQLite 完整示例
database_manager = DatabaseManager(
    db_type="sqlite",
    config={
        "root_path": "/path/to/your/database/folder"  # 包含SQLite文件的目录路径
    }
)

# MySQL 完整示例
database_manager = DatabaseManager(
    db_type="mysql",
    config={
        "host": "localhost",           # 数据库主机地址
        "user": "root",               # 用户名
        "password": "your_password",   # 密码
        "database": "your_database_name",  # 数据库名
        "port": 3306                  # 端口号（可选，默认3306）
    }
)
```

### 提示词模板配置

算子支持使用预定义的提示词模板，可以通过以下方式导入和使用：

```python
from dataflow.prompts.text2sql import (
    Text2SQLCotGeneratorPrompt,
    SelectSQLGeneratorPrompt,
    Text2SQLQuestionGeneratorPrompt,
    Text2SQLPromptGeneratorPrompt,
    Text2SQLCorrespondenceFilterPrompt,
    SQLVariationGeneratorPrompt
)
```

后文使用的`llm_serving`、`storage`、`database_manager`和提示词模板即为此处已定义的接口对象，完整调用示例可参考实际的pipeline代码。

对于传参，算子对象的构造函数主要传递与算子配置相关的信息，配置后可以一配置多调用；而`X.run()`函数传递与IO相关的`key`信息，详细可见后文算子说明示例。

## 详细算子说明

### 数据生成算子

#### 1. SQLGenerator

**功能描述：** 基于数据库Schema生成多样化的SQL语句
- 生成覆盖各种SQL语法、难度的查询语句
- 支持复杂查询如JOIN、子查询、聚合函数等

**输入参数：**

- `__init__()`
  - `llm_serving`: LLM服务接口，用于SQL生成
  - `database_manager`: 数据库管理器，用于访问数据库Schema
  - `generate_num`: 每个数据库生成SQL语句的数量
  - `prompt_template`: SQL生成的提示词模板

- `run()`
  - `output_sql_key`: 输出SQL语句字段名，默认"SQL"
  - `output_db_id_key`: 输出数据库ID字段名，默认"db_id"
  - `output_sql_complexity_key`: 输出SQL复杂度字段名，默认"sql_complexity_type"

**主要特性：**

- 智能Schema分析和SQL模板生成
- 支持多种数据库类型（SQLite、MySQL）
- 自动处理表关系和外键约束
- 生成覆盖不同难度等级的SQL

**使用示例：**

```python
from dataflow.prompts.text2sql import SelectSQLGeneratorPrompt

sql_generator = SQLGenerator(
    database_manager=database_manager,
    generate_num=50,
    prompt_template=SelectSQLGeneratorPrompt()
)
sql_generator.run(
    storage=storage.step(),
    output_sql_key="SQL",
    output_db_id_key="db_id",
    output_sql_complexity_key="sql_complexity_type"
)
```

#### 2. SQLVariationGenerator🚀

**功能描述：** 基于SQL语句和数据库Schema生成SQL语句变体
- 增加语法多样性
- 支持别名替换、子查询转换、JOIN重写等
- 有效扩充训练数据的多样性

**输入参数：**

- `__init__()`
  - `llm_serving`: LLM服务接口，用于SQL变体生成
  - `database_manager`: 数据库管理器，用于验证变体正确性
  - `num_variations`: 每个SQL生成的变体数量，默认5
  - `prompt_template`: SQL变体生成的提示词模板

- `run()`
  - `input_sql_key`: SQL语句字段名，默认"SQL"
  - `input_db_id_key`: 数据库ID字段名，默认"db_id"
  - `output_sql_variation_type_key`: 输出SQL变体类型字段名，默认"sql_variation_type"

**主要特性：**

- 智能SQL变体生成
- 覆盖多种不同变体方向，确保SQL语句的多样性
- 支持复杂查询的多种表达方式

**使用示例：**

```python
from dataflow.prompts.text2sql import SQLVariationGeneratorPrompt

sql_variation_generator = SQLVariationGenerator(
    database_manager=database_manager,
    num_variations=5,
    prompt_template=SQLVariationGeneratorPrompt()
)
sql_variation_generator.run(
    storage=storage.step(),
    input_sql_key="SQL",
    input_db_id_key="db_id",
    output_sql_variation_type_key="sql_variation_type"
)
```

#### 3. Text2SQLQuestionGenerator

**功能描述：** 基于SQL语句生成对应的自然语言问题
- 分析SQL语义生成合理的自然语言问题
- 使用embedding技术选择最优问题候选
- 确保问题与SQL查询意图的一致性
- 支持多种问题表达风格

**输入参数：**

- `__init__()`
  - `llm_serving`: LLM服务接口，用于问题生成
  - `embedding_serving`: 嵌入模型接口，用于问题选择
  - `database_manager`: 数据库管理器，用于Schema信息获取
  - `question_candidates_num`: 问题候选数量，默认5
  - `prompt_template`: 问题生成的提示词模板

- `run()`
  - `input_sql_key`: SQL语句字段名，默认"SQL"
  - `input_db_id_key`: 数据库ID字段名，默认"db_id"
  - `output_question_key`: 输出问题字段名，默认"question"
  - `output_evidence_key`: 输出证据字段名，默认"evidence"

**主要特性：**

- 基于SQL语义的智能问题生成
- 多候选问题生成和最优选择
- 结合数据库Schema的上下文理解
- 确保问题的自然性和准确性
- 自动补充 `question_type` 问题类型字段

**使用示例：**

```python
from dataflow.prompts.text2sql import Text2SQLQuestionGeneratorPrompt

text2sql_question_generator = Text2SQLQuestionGenerator(
    embedding_serving=embedding_serving,
    database_manager=database_manager,
    question_candidates_num=5,
    prompt_template=Text2SQLQuestionGeneratorPrompt()
)
text2sql_question_generator.run(
    storage=storage.step(),
    input_sql_key="SQL",
    input_db_id_key="db_id",
    output_question_key="question",
    output_evidence_key="evidence"
)
```

#### 4. Text2SQLPromptGenerator✨

**功能描述：** 构建包含Schema和问题的训练提示词
- 格式化数据库Schema信息
- 结合问题生成标准化的训练提示词
- 支持多种Schema格式（DDL、格式化Schema等）
- 可配置是否包含示例数据

**输入参数：**

- `__init__()`
  - `database_manager`: 数据库管理器，用于Schema信息获取
  - `prompt_template`: 提示词模板，必须包含{schema}和{question}占位符

- `run()`
  - `input_question_key`: 问题字段名，默认"question"
  - `input_db_id_key`: 数据库ID字段名，默认"db_id"
  - `input_evidence_key`: 证据字段名，默认"evidence"
  - `output_prompt_key`: 输出提示词字段名，默认"prompt"

**主要特性：**

- 灵活的提示词模板系统
- 多种Schema格式支持
- 自动Schema格式化和优化
- 支持包含示例数据的Schema

**使用示例：**

```python
from dataflow.prompts.text2sql import Text2SQLPromptGeneratorPrompt

text2sql_prompt_generator = Text2SQLPromptGenerator(
    database_manager=database_manager,
    prompt_template=Text2SQLPromptGeneratorPrompt()
)
text2sql_prompt_generator.run(
    storage=storage.step(),
    input_question_key="question",
    input_db_id_key="db_id",
    input_evidence_key="evidence",
    output_prompt_key="prompt"
)
```

#### 5. Text2SQLCoTGenerator

**功能描述：** 生成SQL推理的逐步思维链过程
- 基于问题和SQL生成详细的推理步骤
- 解释SQL构建的逻辑过程
- 生成多个候选推理过程（不做验证）
- 提升模型的推理能力和可解释性

**输入参数：**

- `__init__()`
  - `llm_serving`: LLM服务接口，用于CoT生成
  - `database_manager`: 数据库管理器，用于Schema信息获取
  - `sampling_num`: 生成候选推理过程数量，默认3
  - `prompt_template`: CoT生成的提示词模板

- `run()`
  - `input_sql_key`: SQL语句字段名，默认"SQL"
  - `input_question_key`: 问题字段名，默认"question"
  - `input_db_id_key`: 数据库ID字段名，默认"db_id"
  - `input_evidence_key`: 证据字段名，默认"evidence"
  - `output_cot_key`: 输出CoT推理字段名，默认"cot_reasoning"（实际输出列为 `cot_responses`）

**主要特性：**

- 高质量的推理链生成
- 多候选推理过程输出（`cot_responses`）
- 结合Schema的上下文推理
- 支持复杂查询的逐步分解

**使用示例：**

```python
from dataflow.prompts.text2sql import Text2SQLCotGeneratorPrompt

text2sql_cot_generator = Text2SQLCoTGenerator(
    llm_serving=cot_generation_llm_serving,
    database_manager=database_manager,
    sampling_num=3,
    prompt_template=Text2SQLCotGeneratorPrompt()
)
text2sql_cot_generator.run(
    storage=storage.step(),
    input_sql_key="SQL",
    input_question_key="question",
    input_db_id_key="db_id",
    input_evidence_key="evidence",
    output_cot_key="cot_reasoning"
)
```

#### 6. Text2SQLCoTVotingGenerator✨

**功能描述：** 对候选CoT进行执行一致性投票，选出最终推理过程
- 从 `cot_responses` 中提取SQL并执行
- 基于执行结果一致性进行投票
- 输出最终 `cot_reasoning`

**输入参数：**

- `__init__()`
  - `database_manager`: 数据库管理器，用于执行SQL并比较结果

- `run()`
  - `input_cot_responses_key`: 候选CoT字段名，默认"cot_responses"
  - `input_db_id_key`: 数据库ID字段名，默认"db_id"
  - `output_cot_key`: 输出最终CoT字段名，默认"cot_reasoning"

**主要特性：**

- 基于执行一致性的可靠投票
- 自动处理无效候选与并列情况
- 生成最终可用的推理过程

**使用示例：**

```python
text2sql_cot_voter = Text2SQLCoTVotingGenerator(
    database_manager=database_manager
)
text2sql_cot_voter.run(
    storage=storage.step(),
    input_cot_responses_key="cot_responses",
    input_db_id_key="db_id",
    output_cot_key="cot_reasoning"
)
```

### 数据评估算子

#### 1. SQLComponentClassifier

**功能描述：** 基于SQL语法复杂度进行难度分级
- 分析SQL语句的语法组件复杂度
- 根据JOIN数量、子查询深度、聚合函数等进行评分
- 支持自定义难度阈值和标签
- 提供标准化的难度分类体系

**输入参数：**

- `__init__()`
  - `difficulty_thresholds`: 难度阈值列表，默认[2, 4, 6]
  - `difficulty_labels`: 难度标签列表，默认['easy', 'medium', 'hard', 'extra']

- `run()`
  - `input_sql_key`: SQL语句字段名，默认"SQL"
  - `output_difficulty_key`: 输出难度标签字段名，默认"sql_component_difficulty"

**主要特性：**

- 基于SQL语法结构的复杂度分析
- 可配置的难度阈值和标签
- 快速批量处理能力
- 标准化的难度评估体系

**使用示例：**

```python
sql_component_classifier = SQLComponentClassifier(
    difficulty_thresholds=[2, 4, 6],
    difficulty_labels=['easy', 'medium', 'hard', 'extra']
)
sql_component_classifier.run(
    storage=storage.step(),
    input_sql_key="SQL",
    output_difficulty_key="sql_component_difficulty"
)
```

#### 2. SQLExecutionClassifier🚀

**功能描述：** 基于模型执行成功率进行难度分级
- 使用LLM多次尝试生成SQL来评估难度
- 根据模型成功率动态调整难度等级
- 提供更贴近实际应用的难度评估
- 支持自定义难度配置和生成次数

**输入参数：**

- `__init__()`
  - `llm_serving`: LLM服务接口，用于SQL生成测试
  - `database_manager`: 数据库管理器，用于SQL执行验证
  - `num_generations`: 测试生成次数，默认10
  - `difficulty_thresholds`: 难度阈值列表，默认[2, 5, 9]
  - `difficulty_labels`: 难度标签列表，默认['extra', 'hard', 'medium', 'easy']

- `run()`
  - `input_sql_key`: SQL语句字段名，默认"SQL"
  - `input_db_id_key`: 数据库ID字段名，默认"db_id"
  - `input_prompt_key`: 提示词字段名，默认"prompt"
  - `output_difficulty_key`: 输出难度标签字段名，默认"sql_execution_difficulty"

**主要特性：**

- 基于实际模型性能的难度评估
- 动态难度调整机制
- 多次生成的统计分析
- 更符合实际应用场景的难度分级

**使用示例：**

```python
sql_execution_classifier = SQLExecutionClassifier(
    llm_serving=llm_serving,
    database_manager=database_manager,
    num_generations=10,
    difficulty_thresholds=[2, 5, 9],
    difficulty_labels=['extra', 'hard', 'medium', 'easy']
)
sql_execution_classifier.run(
    storage=storage.step(),
    input_sql_key="SQL",
    input_db_id_key="db_id",
    input_prompt_key="prompt",
    output_difficulty_key="sql_execution_difficulty"
)
```

### 数据过滤算子

#### 1. SQLExecutionFilter✨

**功能描述：** 验证SQL语句的可执行性和语法正确性
- 在真实数据库环境中执行SQL语句
- 检测语法错误、运行时错误和逻辑错误
- 过滤无法正常执行的SQL语句
- 确保数据集中SQL的有效性和可用性

**输入参数：**

- `__init__()`
  - `database_manager`: 数据库管理器，用于SQL执行和验证

- `run()`
  - `input_sql_key`: SQL语句字段名，默认"SQL"
  - `input_db_id_key`: 数据库ID字段名，默认"db_id"

**主要特性：**

- 实时SQL执行验证
- 自动过滤执行失败的SQL语句
- 高效的批量处理能力

**使用示例：**

```python
sql_execution_filter = SQLExecutionFilter(
    database_manager=database_manager
)
sql_execution_filter.run(
    storage=storage.step(),
    input_sql_key="SQL",
    input_db_id_key="db_id"
)
```

#### 2. SQLExecutabilityFilter✨

**功能描述：** 使用查询计划过滤不可执行SQL
- 通过数据库EXPLAIN生成查询计划
- 不执行SQL即可判断可执行性
- 过滤无法执行或不合法的SQL语句

**输入参数：**

- `__init__()`
  - `database_manager`: 数据库管理器，用于生成查询计划

- `run()`
  - `input_sql_key`: SQL语句字段名，默认"SQL"
  - `input_db_id_key`: 数据库ID字段名，默认"db_id"

**主要特性：**

- 不执行SQL的快速过滤
- 更低的资源消耗与更高的吞吐
- 可与执行过滤器组合使用

**使用示例：**

```python
sql_executability_filter = SQLExecutabilityFilter(
    database_manager=database_manager
)
sql_executability_filter.run(
    storage=storage.step(),
    input_sql_key="SQL",
    input_db_id_key="db_id"
)
```

#### 3. Text2SQLCorrespondenceFilter✨

**功能描述：** 验证SQL与问题描述的语义一致性
- 使用LLM判断SQL是否回答了问题
- 检查问题与SQL逻辑的匹配度
- 过滤语义不一致的数据对

**输入参数：**

- `__init__()`
  - `llm_serving`: LLM服务接口，用于一致性判断
  - `database_manager`: 数据库管理器，用于Schema读取
  - `prompt_template`: 一致性检查的提示词模板

- `run()`
  - `input_sql_key`: SQL语句字段名，默认"SQL"
  - `input_db_id_key`: 数据库ID字段名，默认"db_id"
  - `input_question_key`: 问题字段名，默认"question"
  - `input_evidence_key`: 证据字段名，默认"evidence"

**主要特性：**

- 智能语义一致性检查
- 结合Schema进行一致性判断
- 自动过滤不匹配的数据对

**使用示例：**

```python
from dataflow.prompts.text2sql import Text2SQLCorrespondenceFilterPrompt

text2sql_correspondence_filter = Text2SQLCorrespondenceFilter(
    llm_serving=llm_serving,
    database_manager=database_manager,
    prompt_template=Text2SQLCorrespondenceFilterPrompt()
)
text2sql_correspondence_filter.run(
    storage=storage.step(),
    input_sql_key="SQL",
    input_db_id_key="db_id",
    input_question_key="question",
    input_evidence_key="evidence"
)
```