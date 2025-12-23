---
title: 新算子
createTime: 2025/06/12 12:00:00
permalink: /zh/dev_guide/new_algo/
---

## 新算子

DataFlow算子有统一基类`OperatorABC`，位于[https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/core/operator.py](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/core/operator.py)，这些算子需要实现基类所需的固定方法`run()`

如果想要在DataFlow中添加新算子，可以参考[PromptedGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/core_text/generate/prompted_generator.py)算子的实现，并需实现如下步骤：
1. 文件名用下划线命名法，算子类名用驼峰命名法
2. 用`@OPERATOR_REGISTRY.register()`修饰算子类，使其可以被全局注册机捕捉到
3. 向算子路径的上级`__init__.py`中(比如[https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/core_text/__init__.py](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/core_text/__init__.py)) 按照现有算子的Lazzyloader注册方法，添加import路径以便Lazzyloader能识别到。

特别的，如果算子需要实现`prompt_template`则需要进一步满足如下条件，可以参考[ReasoningAnswerGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py)：
   ```python
   from dataflow.core.prompt import prompt_restrict, DIYPromptABC
   @prompt_restrict(
       MathAnswerGeneratorPrompt,
       GeneralAnswerGeneratorPrompt,
       DiyAnswerGeneratorPrompt
   )
   @OPERATOR_REGISTRY.register()
   class ReasoningAnswerGenerator(OperatorABC):
     '''
    Answer Generator is a class that generates answers for given questions.
    '''
    def __init__(self,
                llm_serving: LLMServingABC,
                prompt_template: Union[MathAnswerGeneratorPrompt, GeneralAnswerGeneratorPrompt, DiyAnswerGeneratorPrompt, DIYPromptABC] = MathAnswerGeneratorPrompt
                ):
        
        self.logger = get_logger()
        
        if prompt_template is None:
            prompt_template = MathAnswerGeneratorPrompt()
        self.prompts = prompt_template
        self.llm_serving = llm_serving
   ```
算子需要被`@prompt_restrict`装饰器修饰，并且需要有`prompt_template`形参，二者都需要写好当前算子支持的所有的提示词模板类。

都实现好后，可以自行测试比如`from dataflow.operators.core_text import PromptedGenerator`来测试能否正常import成功。


也可以通过[https://github.com/OpenDCAI/DataFlow/tree/main/test/xlsx_overview_of_dataflow](https://github.com/OpenDCAI/DataFlow/tree/main/test/xlsx_overview_of_dataflow)这两个全局注册脚本来检查当前DataFlow注册机内所有的算子信息，正确出现了新算子即说明新算子添加成功。