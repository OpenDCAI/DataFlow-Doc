---

title: New Operators
createTime: 2025/06/12 12:00:00
permalink: /en/dev_guide/new_algo/

---

## New Operators

DataFlow operators share a unified base class, `OperatorABC`, which is located at
[https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/core/operator.py](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/core/operator.py).
All operators are required to implement the mandatory method `run()` defined in this base class.

If you want to add a new operator to DataFlow, you can refer to the implementation of the
[PromptedGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/core_text/generate/prompted_generator.py) operator and follow these steps:

1. Use snake_case for the file name and CamelCase for the operator class name.
2. Decorate the operator class with `@OPERATOR_REGISTRY.register()` so that it can be captured by the global registry.
3. Add the import path to the parent `__init__.py` of the operator directory (for example,
   [https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/core_text/**init**.py](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/core_text/__init__.py)), following the existing LazyLoader registration pattern, so that the LazyLoader can recognize the new operator.

In particular, if the operator needs to implement a `prompt_template`, the following additional requirements must be met. You can refer to
[ReasoningAnswerGenerator](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) as an example:

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
                 prompt_template: Union[
                     MathAnswerGeneratorPrompt,
                     GeneralAnswerGeneratorPrompt,
                     DiyAnswerGeneratorPrompt,
                     DIYPromptABC
                 ] = MathAnswerGeneratorPrompt
                 ):

        self.logger = get_logger()

        if prompt_template is None:
            prompt_template = MathAnswerGeneratorPrompt()
        self.prompts = prompt_template
        self.llm_serving = llm_serving
```

The operator must be decorated with `@prompt_restrict`, and it must include a `prompt_template` parameter. Both must explicitly list all prompt template classes supported by the operator.

After completing the implementation, you can test it by running, for example,
`from dataflow.operators.core_text import PromptedGenerator` to verify that the import works correctly.

You can also use the two global registration scripts located at
[https://github.com/OpenDCAI/DataFlow/tree/main/test/xlsx_overview_of_dataflow](https://github.com/OpenDCAI/DataFlow/tree/main/test/xlsx_overview_of_dataflow)
to inspect all operator information registered in the DataFlow registry. If the new operator appears correctly, it indicates that the operator has been successfully added.
