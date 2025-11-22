---
title: 框架设计
icon: material-symbols:auto-transmission-sharp
createTime: 2025/06/13 14:59:56
permalink: /zh/guide/basicinfo/framework/
---
![Dataflow-Framework](/dataflow_framework.jpg)
# 框架设计
Dataflow的框架主要数据处理逻辑分为算子层(`operator`)和流水线(`pipeline`)层。此外，还有数据管理`storage`和大模型后端`LLMServing`等组件共同支持。

此外，为了使用AI辅助数据处理，我们额外添加了`Agent for Dataflow`模块。该模块可以：
- (1)根据需求编写新的Dataflow算子
- (2)根据需求编排现有Dataflow算子，组成Pipeline。
- (3)通过Agent自动解决数据分析任务。


## 数据管理
DataFlow目前主要关注于大模型文本数据的处理，为了提高易用性，DataFlow内核通过[`pandas`](https://github.com/pandas-dev/pandas)的`DataFrame`来作为载体实现读写数据（本质上是以表格形式承载的数据）。因此，DataFlow支持常见的`json, jsonl, csv, parquet, pickle`等多种文本数据集格式作为输入和输出。并以对`DataFrame`表**增删查改**的方式来实现数据的清洗，扩增和评估。

实质上数据集管理的功能由`storage`类实现，源码位于[`storage.py`](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/utils/storage.py)。目前框架主要依赖**文件系统**作为数据读写与缓存的载体，未来会支持**数据库系统**的读写以支持大量数据的处理。

## 大模型后端
大批量的数据的扩增，过滤，打分都需要借助大语言模型强大而灵活的语义理解能力。因此，DataFlow提供了`LLMServingABC`抽象类来统一管理在线/本地大模型，也方便模型在算子间的复用。大模型后端目前主要包括如下类：
- `LocalModelLLMServing`: 使用[vLLM](https://github.com/vllm-project/vllm)或[SGLang](https://github.com/sgl-project/sglang)作为推理后端，在本地GPU部署上述框架支持的大模型作为推理服务。适合轻量用户单机使用。
- `APILLMServing_request`: 使用`request`方式向网络上的大模型服务商的API（比如ChatGPT，Deepseek）发起请求，支持多进程并发请求。同时，适合企业级用户基于Ray等框架在集群部署大模型后，通过本类请求相应API。

## DataFlow 算子

### 算子的定义

DataFlow 算子是对原始数据执行的基本处理单元，通常基于规则、深度学习模型或大语言模型（LLM）实现。以最基础的算子`PromptedGenerator`为例，该算子功能上模仿大家调用GPT的方式，使用同一个提示词批量处理批量的文字。

![](/dataflow_operator.jpg)
具体逻辑如上图所示，该算子读取原始数据中的问题条目，即`Q1`、`Q2`...代表的多条问题，将其批量与用户定义的`System Prompt`组合后，传给`LLMServing`进行推理，获得输出的答案，即`A1`、`A2`...将上述内容组合为如下格式后，即可完成该算子的任务：
```json
[
    {"question":"<Q1>", "Answer": "<A1>"},
    {"question":"<Q2>", "Answer": "<A2>"}
    ...
]
```

### 算子类的代码风格和定义规范

DataFlow的算子的设计参考了`PyTorch`的代码风格，易于理解。下方代码块是上述`PromptedGenerator`算子调用的代码实现：

```python
from dataflow.operators.core_text import PromptedGenerator

prompted_generator = PromptedGenerator(
    llm_serving=llm_serving # 传入LLMServing类作为大模型后端，这里省略了该类的定义
)

prompted_generator.run(
    storage = self.storage.step(), # 数据管理的类，这里省略的该类的定义
    system_prompt = "Please solve this math problem.",
    input_key = "problem", # 从Dataframe该字段（列），读入内容
    output_key= "solution" # 输出结果到Dataframe的该字段（列）
)
```

Dataflow算子类需要定义如下三个函数：
- **`__init__`函数：** 初始化必要的设置和超参数；
  - 如果算子使用了大模型，需要以`llm_serving`字段在`__init__`函数中传参。不允许算子内部自行声明大模型。
- **`run`函数：** 有一个`storage`形参，和多个key形参作为参数用于确认该算子会读/写数据表Dataframe的哪些列。其余未被涉及的列不会参与算子逻辑。
  - `run`函数的第一个形参一定是`storage`，并传入数据管理类，用于实现算子间通信，链接所有算子。
  - `run`函数中除了`storage`的形参名称都必须以`input_`或`output_`作为前缀，分别代表算子的**读入算子的字段**和算子**输出的字段**。
  - `run`函数中的key形参的**值**可由用户灵活指定，以适应LLM数据集多变的字段命名方式（比如：`question`, `instruction`, `human`都会用来指代多轮对话中人类的问题）。此时设置为`input_key="question"`, `input_key="instruction"` 或 `input_key="human"`即可实现对于该类数据集的自由读取。
  - `run`函数内部不应该有除了`storage`和各种key以外的任何参数。
  - 如果算子只需读取/写出一个字段，则一般通过`input_key`和`output_key`来指定。
  - 如果算子不需要写出字段，则完全没有`output_*`这样的形参。
  - 如果需要读取/写出多个字段，则一般通过其功能指定形参名，比如`input_question_key`,`input_answer_key`，`output_question_quality_key`。
- `get_desc`函数，可以直接调用，获得该算子的功能描述，和形参列表描述。可通过对`lang`形参传`zh`获得中文描述或`en`获得英文描述。该功能可以服务于Agent理解算子功能。

### 算子的分类规范
Dataflow的算子目前设置了两级分类。更多的分类级别可能会带来分类困难，目前实践中认为这样是较为合理的，如果您有更好的分类方式，也欢迎在Issue中做出讨论。

目前Datalfow中算子的**一级分类**如下：
```shell                                                                                                                                                                                                                                                                
|-- agentic_rag     # Agentic-RAG数据合成
|-- chemistry       # 化学相关
|-- conversations   # 多轮对话
|-- core_speech     # 核心-语音
|-- core_text       # 核心-文本
|-- core_vision     # 核心-视觉
|-- general_text    # 通用-文本
|-- knowledge_cleaning # 知识库清洗（MinerU）
|-- reasoning       # 强推理数据
|-- text2sql        # 自然语言到SQL
|-- text_pt         # 文本-预训练
`-- text_sft        # 文本-有监督微调
```
一级分类的分类逻辑为：
- **core算子：** 体现了Dataflow设计理念的核心算子。
  - 其他类别的算子或多或少是参考了某个`core`算子实现的。`core`算子可以认为是整个dataflow所有算子逻辑的抽象。或者说是其他算子的一个具象的基类（虽然实际不存在代码上的继承关系）。
  - `core`算子理论上必须是**数量有限，相对收敛**的。
  - 所以，我们建议所有刚接触Dataflow的用户首先学习了解`core_*`前缀分类的算子。
  - `core`算子按照模态做了拆分，但统称为`core`算子。
  
- **领域算子：** 为了实现**多种模态，多种领域，多种任务**的功能，我们具体的对每一个任务的算子进行了分类。
  - 一般来说，领域算子可以看做是对于`core`算子的二次封装，领域算子一般都能找到对应的`core`算子。这些领域算子都可以通过填充`core`算子的形参来等效替代。
  - 领域算子理论上是**数量无限的，不收敛的**，每一个垂域内部会有无限的评估和生成需求。
  - 不过，Dataflow中的领域算子，是为了实现某流水线的最佳表现而保留的所有的必要算子，所以看上去并不“无限”。
  - 所以，我们欢迎用户填充`core`算子，或自定义新的领域算子，来满足各自的“无限”需求。也欢迎用户尽可能用我们提供的“已知最优”的领域算子快速实现所需功能。
<!-- 
为了便于进一步展开解释，我们回顾一下Dataflow内部数据的组织形式。

一般情况下，大模型数据保存在这样的json中
```json
[
    {
        "instruction":"An architect is designing a reflective surface for a concert hall in the shape of a horizontal hyperbola with its center at the origin. The two foci of the hyperbola are 8 meters apart, and for acoustic reasons the angle between its asymptotes must be 90°. In addition, one of its directrices is the vertical line x = –d. \n \n(a) Find the value of d.\n \n(b) Determine the equation of the hyperbola.",
        "output":null,
        "golden_answer":"8",
        "source":"Bigmath_synth"
    },
    {
        "instruction":"A certain number is processed differently depending on whether it is even or odd:\n• If the number is even, it is first divided by 2, then multiplied by 5, and finally 4 is added, giving a result of 34.\n• If the number is odd, it is first divided by 3, then multiplied by 7, and finally 2 is subtracted, yielding 33.\nDetermine all possible original numbers.",
        "output":"Let x be the original number.\n\nCase 1: x is even.\n  (x÷2)·5 + 4 = 34  \n  ⇒ 5x\/2 + 4 = 34  \n  ⇒ 5x\/2 = 30  \n  ⇒ x = 12.  \n  (12 is even, so this is valid.)\n\nCase 2: x is odd.\n  (x÷3)·7 – 2 = 33  \n  ⇒ 7x\/3 – 2 = 33  \n  ⇒ 7x\/3 = 35  \n  ⇒ x = 15.  \n  (15 is odd, so this is valid.)\n\nAnswer: The only possible originals are 12 (in the even‐case) or 15 (in the odd‐case).",
        "golden_answer":"15",
        "source":"Bigmath_synth"
    }
    ...
]
```
这样的数据读取到Dataflow中会被组织在Dataframe的表格中。为了方便称呼，我们称呼每一个json列表中的一条记录为“一行数据”，而每一个像`instruction`这样的字段称为“一列数据” -->

二级分类的分类逻辑首先会通过文件夹和文件名共同体现，包含如下四个文件夹：
- `generate`: 包含两种范式：
  - 1）数据条目数量不变，每一个条目出现新的Key，对应value是一段新的长文本。即给每一条数据添加新的信息和字段；
    - 算子类一般以`*Generator`作为后缀。
  - 2）数据条目数量增加，丰富整个数据集的信息量。
    - 算子类一般以`*RowGenerator`作为后缀
- `eval`：包含两种范式：
  - 1）数据条目数量不变，每一个条目出现一个新的字段，可以是分数或者类别作为评估结果；
    - 算子类一般以`SampleEvaluator`作为后缀。
  - 2）数据条目数量和字段值都不变，为整个数据集进行评估，对整个数据集输出一个总的评价指标。
    - 算子类一般以`DatasetEvaluator`作为后缀。
- `filter`：从多条数据条目过滤成少量数据条目，每一个条目内容不变，或者仅多了一个经由`eval`产生的字段。
  - 算子类一般以`Filter`作为后缀。
- `refine`：数据条目数量不变，每一个条目对于某一个字段进行修改。
  - 算子类一般以`Refiner`作为后缀。
进一步的具体功能
> 举一些算子的例子：（后续补充具体算子名称）
> 1. generate: 根据问题生成答案；
> 2. eval: 为数学题按照难度打分；为问答对的学科类别进行分类；
> 3. filter: 过滤掉答案不对的条目；
> 4. refine: 去掉文字中的url；去掉文字中的emoji。
    
## DataFlow 流水线（Pipeline）

### 流水线概览
通过组合多种不同算子为流水线（Pipeline），即可实现复杂的数据治理任务。如下面的“强推理数据合成流水线”的示意图所示，每一个矩形单元均可视为一个独立的 DataFlow 算子，用于完成特定的数据加工任务（如扩增、评估、过滤等）。

![Reasoning-Pipeline](/Reasoning_Pipeline.png)

DataFlow中的流水线一般以如下范式组织算子，整体代码风格仍然向`PyTorch`看齐，以合成思维链用的`Reasoning`流水线为例，完整流水线代码如下：
```python
from dataflow.operators.reasoning import (
    ReasoningQuestionGenerator,
    ReasoningAnswerGenerator,
)
from dataflow.operators.reasoning import ReasoningQuestionFilter, ReasoningAnswerNgramFilter, ReasoningAnswerModelJudgeFilter
from dataflow.utils.storage import FileStorage
from dataflow.serving import APILLMServing_request
from dataflow.core import LLMServingABC
from dataflow.prompts.reasoning.general import (
    GeneralQuestionFilterPrompt,
    GeneralAnswerGeneratorPrompt,
    GeneralQuestionSynthesisPrompt,
    AnswerJudgePrompt,
)

class GeneralReasoning_APIPipeline():
    def __init__(self, llm_serving: LLMServingABC = None):
        
        self.storage = FileStorage(
            first_entry_file_name="../example_data/ReasoningPipeline/pipeline_general.json",
            cache_path="./cache_local",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )

        # use API server as LLM serving
        self.llm_serving = APILLMServing_request(
                    api_url="http://api.openai.com/v1/chat/completions",
                    model_name="gpt-4o",
                    max_workers=30
        )

        self.question_filter_step1 = ReasoningQuestionFilter(
            system_prompt="You are an expert in evaluating mathematical problems. Follow the user's instructions strictly and output your final judgment in the required JSON format.",
            llm_serving=self.llm_serving,
            prompt_template=GeneralQuestionFilterPrompt()
        )
        
        self.question_gen_step2 = ReasoningQuestionGenerator(
            num_prompts=1,
            llm_serving=self.llm_serving,
            prompt_template=GeneralQuestionSynthesisPrompt()
        )
        
        self.answer_generator_step3 = ReasoningAnswerGenerator(
            llm_serving=self.llm_serving,
            prompt_template=GeneralAnswerGeneratorPrompt()
        )
        self.answer_model_judge_step4 = ReasoningAnswerModelJudgeFilter(
            llm_serving=self.llm_serving,
            prompt_template=AnswerJudgePrompt(),
            keep_all_samples=True
        )
        self.answer_ngram_filter_step5 = ReasoningAnswerNgramFilter(
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
        self.answer_generator_step3.run(
            storage = self.storage.step(),
            input_key = "instruction", 
            output_key = "generated_cot"
        ),
        self.answer_model_judge_step4.run(
            storage = self.storage.step(),
            input_question_key = "instruction",
            input_answer_key = "generated_cot",
            input_reference_key = "golden_answer"
        ),
        self.answer_ngram_filter_step5.run(
            storage = self.storage.step(),
            input_question_key = "instruction",
            input_answer_key = "generated_cot"
        )

if __name__ == "__main__":
    pl = GeneralReasoning_APIPipeline()
    pl.forward()
```

目前DataFlow提供了多种预设`Pipeline`流水线用于完成预定功能。当你熟悉DataFlow框架后，也可以自由搭配现有算子，或设计你自己的新算子来构建适合你数据处理的`pipeline`。

### 进阶：预编译流水线
上述流水线的“规约”实际相当宽松，`__init__`函数和`forward`函数实际上只是两个简单的函数，并没有通过继承任何特殊的基类以对这两个函数做任何额外的检查。

宽松的设计可以便于用户后续实现自己的功能，并且融入自己的业务代码。但是当使用Dataflow-Agent或构建复杂pipeline时，是有必要预先检查各个算子的填入的key进行预先检查的。否则，在执行大量数据和算子时，程序在中间算子才触发一个KeyError的异常退出进程的情况实在令人沮丧。

所以我们提供了一个更有效的`compile()函数`，来提供对于pipeline的“运行前检查”，未来我们也会对该函数提供更多的技术优化。目前该函数的功能仅局限于检查算子的key填充是否合理，以减少Agent的debug次数。

具体来说，下面是一个Dataflow中Pipeline预编译的例子，该例子实现了将英文输入翻译为中日韩三语输出的流水线，**请特别关注高亮的行**，这些行实现了预编译的主要逻辑：

```python
# https://github.com/OpenDCAI/DataFlow/blob/main/test/test_autoop_graph.py

from dataflow.pipeline import PipelineABC   # [!code highlight]
from dataflow.operators.core_text import PromptedGenerator
from dataflow.serving import APILLMServing_request, LocalModelLLMServing_vllm, LocalHostLLMAPIServing_vllm
from dataflow.utils.storage import FileStorage

class AutoOPPipeline(PipelineABC):  # [!code highlight]
    def __init__(self):
        super().__init__()          # [!code highlight]
        self.storage = FileStorage(
            first_entry_file_name="../dataflow/example/GeneralTextPipeline/pt_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_auto_run",
            cache_type="jsonl",
        )
        self.llm_serving = LocalModelLLMServing_vllm(
            hf_model_name_or_path="/mnt/public/model/huggingface/Qwen3-0.6B"
        )
        self.op1 = PromptedGenerator(
            llm_serving=self.llm_serving,
            system_prompt="Translate following content into Chinese:",
        )
        self.op2 = PromptedGenerator(
            llm_serving=self.llm_serving,
            system_prompt="Translate following content into Korean:",
        )
        self.op3 = PromptedGenerator(
            llm_serving=self.llm_serving,
            system_prompt="Translate following content into Japanese:"
        )
        
    def forward(self):
        self.op1.run(
            self.storage.step(),
            input_key='raw_content',
            # output_key='content_CN'
            output_key="raw_content"
        )
        self.op2.run(
            self.storage.step(),
            input_key='raw_content',
            # input_key="raw_content",
            output_key='content_JA'
        )
        self.op3.run(
            self.storage.step(),
            input_key='raw_content',
            output_key='content_KR'
        )
        
if __name__ == "__main__":
    pipeline = AutoOPPipeline()
    pipeline.compile()  # [!code highlight]
    print(pipeline.llm_serving_list)
    print(pipeline.llm_serving_counter)
    pipeline.draw_graph(port=8081, hide_no_changed_keys=True) # [!code highlight]
    pipeline.forward() # 正常的运行
```

综上，为了实现预编译，需要在Pipeline类中实现如下细节：
1. Pipeline类需要继承`dataflow.pipeline.PipelineABC`，并在`__init__`函数中使用`super().__init__()`来启用必要的修饰。
2. 在运行时运行`pipeline.complie()`，即可启动编译，会将动态的算子拓扑结构落实为静态图，并提前检测算子逻辑和key逻辑是否正确，即运行前检查。无需等到执行到该算子时才报逻辑错误。
    - 比如：上面的例子中，我将算子`op3`的`run`的`input_key`改为`raw_input`，则理论上数据表中不存在该key，找不到该key，此时执行compile会提前抛出如下异常，可以高效辅助Agent减少debug轮数：
    ```shell
     2025-09-23 12:54:36,686 | Pipeline.py         - Pipeline            - _build_operator_nodes_graph-   133 - DataFlow   |  WARNING | Processno 1956836 - Threadno 140493607409472 : Key Matching Error in following Operators during pipeline.compile():
      - Input key 'raw_inputs' in `op3` (class <PromptedGenerator>) does not match any output keys from previous operators or dataset keys. Check parameter 'input_key' in the `op3.run()`.
    ```
3. 编译后，算子拓扑结构会落实为静态图的拓扑结构，执行`pipeline.forward()`即可正常执行逻辑。
4. 特别的，运行`pipeline.draw_graph()`函数可以自动帮你在画布上绘制你当前流水线的拓扑结构。该指令会在指定端口自动呼出浏览器，并提供可以拖拽查看的HTML动态页面，以供用户检查当前流水线代码组织的算子逻辑是否无误。上述案例建立的HTML拓扑图可视化如下：
   - ![](/dataflow_pipeline_graph.png)
   - 每一个节点代表一个算子，或 数据集输入和输出的节点。
   - 括号内的`(step=n)`即为各个节点的run函数调用的顺序，特别的，算子颜色会根据step从小到大，从紫色到蓝色渐变，以便直观观察。
   - 将鼠标停放在算子上，可以看到具体的算子的详细信息。

## DataFlow 提示词和提示词模板（Prompt & Prompt Template）

### 定义和功能
大模型数据治理，Prompt是重要的构成部分。为了更好的复用算子，我们提供了提示词和提示词模板用于支持算子功能。它们的定义如下：
1. **提示词**：写死在一个算子内的提示词，一般不会有很明显的替换需求。
2. **提示词模板**：可能需要传入一些额外信息组成完整提示词的模板；亦或是一个算子为了实现不同功能，通过替换不同提示词模板来满足灵活多变需求的设计。
3. 总的来说，提示词和提示词模板对于算子来说，是**多对一**的映射关系。多个提示词可能会同时或者互斥地支持一个算子的功能。

特别的，即便算子内部只有一个很精简的提示词，且被写死，Dataflow也希望该Prompt能被**单独创建一个类**，并被**注册**。


### 代码实现
首先，Dataflow所有的提示词和提示词模板放置在`./dataflow/prompts`路径下，按照对应的流水线名称命名python文件。

所有的提示词必须参考[dataflow.core.prompt.PromptABC](https://github.com/OpenDCAI/DataFlow/blob/691d98e077e9e0a0eb81a8ba0a631c7f542fa7fa/dataflow/core/prompt.py#L5-L15)的实现。其中`PromptABC`是供开发者继承的抽象类，而`DIYPromptABC`是方便用户自行填充新的提示词模板的基类。加以区分是为了方便算子或Agent识别提示词模板的来源。
```python
class PromptABC():
    def __init__(self):
        pass
    def build_prompt(self):
        raise NotImplementedError

class DIYPromptABC(PromptABC):
    def __init__(self):
        super().__init__()
    def build_prompt(self):
        raise NotImplementedError
```

整体规约相对简单，所有的提示词和提示词模板只要实现`build_prompt`函数即可，算子通过调用build_prompt函数来构成需要的提示词。其中`__init__`和`build_prompt`函数的形参列表可以根据需要自行设计拓展。

实际的提示词模板定义时，需要通过`dataflow.utils.registry`下的`PROMPT_REGISTRY`对提示词模板进行注册：
```python
from dataflow.utils.registry import PROMPT_REGISTRY # [!code highlight]
from dataflow.core.prompt import PromptABC

@PROMPT_REGISTRY.register() # [!code highlight]
class DemoPrompt(PromptABC):
    '''
    The prompt for the answer generator.
    '''
    def __init__(self):
        pass

    def build_prompt(self, question: str) -> str:
        """
        为给定数学题目生成系统提示信息
        """
        prompt =  r'''You are helpful agent'''
```

进一步，当提示词被应用于对应算子时，需要通过`dataflow.core.prompt`下的`prompt_restrict`装饰器来修饰对应算子类的声明函数。这一步可以在Dataflow中建立算子到Prompt的映射。
```python
from dataflow.utils.registry import OPERATOR_REGISTRY
from dataflow import get_logger
from dataflow.core import OperatorABC
from dataflow.utils.storage import DataFlowStorage
from dataflow.core import LLMServingABC

from dataflow.core.prompt import DIYPromptABC
from dataflow.prompts.reasoning.math import MathQuestionFilterPrompt    # [!code highlight]
from dataflow.prompts.reasoning.general import GeneralQuestionFilterPrompt  # [!code highlight]
from dataflow.prompts.reasoning.diy import DiyQuestionFilterPrompt  # [!code highlight]

from dataflow.core.prompt import prompt_restrict # [!code highlight]

import re
@prompt_restrict(                   # [!code highlight]
    MathQuestionFilterPrompt,       # [!code highlight]
    GeneralQuestionFilterPrompt,    # [!code highlight]
    DiyQuestionFilterPrompt         # [!code highlight]
)
@OPERATOR_REGISTRY.register() # [!code highlight]
class ReasoningQuestionFilter(OperatorABC):
    def __init__(self,
                 system_prompt: str = "You are a helpful assistant.",
                 llm_serving: LLMServingABC = None,
                 prompt_template = MathQuestionFilterPrompt | GeneralQuestionFilterPrompt | DiyQuestionFilterPrompt | DIYPromptABC # [!code highlight]
                 ):
        self.logger = get_logger()
        if prompt_template is None:
            prompt_template = MathQuestionFilterPrompt()
        self.prompt_template = prompt_template
        self.system_prompt = system_prompt
        self.llm_serving = llm_serving
        self.empty_responses_count = 0  # 添加空响应计数器
        ...
```
这一步会有如下细节，参考上文高亮部分：
1. `prompt_restrict`后的函数需要填入该算子所有持有的prompt类。
2. 如果该算子希望对外**暴露可更换的提示词模板**供用户填入不同功能的提示词，则算子形参列表中必须有一个字段为`prompt_template`并且通过Python类型注解提示用户该位置可填入的选项。
3. 如果该算子内部的提示词是写死的，也需要填`@prompt_restrict`，但是不用管形参列表。

特别的，当完成`prompt_restrict`类型注解后，该算子会额外拥有一个成员`ALLOWED_PROMPTS`，你可以通过如下方式获得该算子可选的提示词或提示词模板，Dataflow的算子也就是通过这样的方式建立了从算子到提示词的“一对多”映射关系。
```python
from dataflow.operators.reasoning import ReasoningQuestionFilter
op1 = ReasoningQuestionFilter()
print(op1.ALLOWED_PROMPTS)
```

得到的输出是：
```python
 2025-09-24 16:25:07,928 | registry.py         - registry            - __getattr__         -   273 - DataFlow   |     INFO | Processno 1986103 - Threadno 140565043730240 : Lazyloader ['dataflow/operators/reasoning/'] trying to import ReasoningQuestionFilter 
(<class 'dataflow.prompts.reasoning.math.MathQuestionFilterPrompt'>, <class 'dataflow.prompts.reasoning.general.GeneralQuestionFilterPrompt'>, <class 'dataflow.prompts.reasoning.diy.DiyQuestionFilterPrompt'>)
```

## DataFlow数据统计

特别的，你可以通过[这些Python脚本](https://github.com/OpenDCAI/DataFlow/tree/main/test/xlsx_overview_of_dataflow)快速导出Excel表格查看DataFlow目前所有的算子和提示词模板的情况。运行后的结果如下，欢迎试玩：

![dataflow_op_statistic.jpg](/dataflow_op_statistic.jpg)

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
