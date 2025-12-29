---
title: 快速上手-多对一的Prompt模板
createTime: 2025/12/29 12:06:02
permalink: /zh/guide/second_pipeline/
icon: solar:flag-2-broken
---
# 快速上手-多对一的Prompt模板

## 概览
本章带您体验Prompt的模板的使用方式。之前我们已经见过`PromptedGenerator`，为了降低使用难度，它没有使用Prompt模板，只用了一个string传参，这主要是为了方便和承担最基础的算子功能。下面需要真正体验DataFlow中`prompt_template`的特点和用法。


## Prompt Template的特征
很多时候Prompt需要的信息不仅需要在算子声明时传入，也可能需要根据数据集内的key-value来组装，并进行一系列后处理后，才能供大模型使用。所以DataFlow中的提示词模板有如下特征：
1. DataFlow中几乎只有`PromptedGenerator`是直接传入一个Python String作为system_prompt的，其他大部分算子都是持有`prompt_template`类的实例作为成员。
2. 其中，有一些希望用户修改并复用`prompt_template`的算子会在`__init__`函数中暴露`prompt_template`形参供用户传入可替换的提示词模板。而另外一些不希望修改的的Prompt则在算子声明时内写死了`prompt_template`类的实例，但并不对外暴露用户可直接修改的接口。
3. `prompt_template -> Operator`是多对一或一对一的关系。
4. 多数情况下`prompt_template`的逻辑是和算子耦合在一起的，所以绝大多数情况下一个`prompt_template`只能服务一个算子。
5. 因为多对一且逻辑耦合，所以用户实现自己的prompt_template进行算子复用的时候，需要参考现有的prompt_template的逻辑实现。


## 多列数据输入的例程
这里以一个非常重要的`core_text`的核心算子`FormatStrPromptedGenerator`为例进行解析。完整例程位于[double_column_input.py](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/statics/playground/playground/format_str_prompt_generator/double_column_input.py)，算子定义位于[format_str_prompted_generator.py](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/core_text/generate/format_str_prompted_generator.py)，提示词模板定义位于[FormatStrPrompt类定义](https://github.com/OpenDCAI/DataFlow/blob/668f03c7a810473a67a3646218849f48e1ebc209/dataflow/prompts/core_text.py#L5)。

> `core_text`分类下的算子都是体现了DataFlow内核使用方式和逻辑的一些算子，建议新手优先学习。其他的各个Pipeline都建立在这些算子的设计模式之上实现的。

---

假设我们现在有这样的多列数据作为输入：
```json
[
    {
        "role": "pig",
        "term": "eat"
    },
    {
        "role": "tiger",
        "term": "chase"
    },
    {
        "role": "people",
        "term": "drink"
    },
    {
        "role": "bird",
        "term": "dance"
    }
]
```
我们希望把每个角色和其对应的动词组合在一起构成一个问句，然后问大模型一个问题。这是没办法靠之前的`PromptedGenerator`实现的，因为它只能输入单列，并输出单列，而现在我们需要从数据集里读入多列来组装Prompt给大模型。

为了实现这个功能，我们构建的Pipeline如下，可以多关注highlight的部分：
```python
from dataflow.operators.core_text import FormatStrPromptedGenerator
from dataflow.serving import APILLMServing_request
from dataflow.utils.storage import FileStorage

from dataflow.prompts.core_text import FormatStrPrompt

class DoubleColumnInputTestCase():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="../example_data/core_text_data/double_column_input.json",
            file_name_prefix="double_column_input",
            cache_path="./cache",
            cache_type="jsonl",
        )

        self.llm_serving = APILLMServing_request(
            api_url="https://api.openai.com/v1/chat/completions",   
            model_name="gpt-4o"
        )

        self.prompt_template = FormatStrPrompt( # [!code highlight]
            f_str_template="What does a {input_role} like to  {input_term}?" # [!code highlight]
        ) # [!code highlight]
        self.operator = FormatStrPromptedGenerator(
            llm_serving=self.llm_serving,
            prompt_template=self.prompt_template # [!code highlight]
        )

    def forward(self):
        self.operator.run(
            storage=self.storage.step(),
            input_role="role", # [!code highlight]
            input_term="term", # [!code highlight]
            output_key="answer",
        )
if __name__ == "__main__":
    model = DoubleColumnInputTestCase()
    model.forward()
```
该算子和对应的提示词模板的使用逻辑为：
1. 构建带Python Format String的`FormatStrPrompt`类作为算子的提示词模板。
2. 把提示词模板传给算子`FormatStrPromptedGenerator`的`prompt_template`形参以初始化算子。
3. 在算子的run函数中传入Format String所对应的数据集中的列名，以建立模板和输入数据的映射关系。run函数的传参有如下特点：
   1. 形参的key-value会用来建立映射，key是对应`f_str_template`中待定的变量的变量名，value是实际数据集中的对应列的字段名。
   2. 注意，这个算子在实现的时候是可变长的形参列表，所有以`input_*`开头的前缀都会被用于匹配。如果有三列数据需要组合，则传入三个形参，并在`f_str_template`正确书写对应的变量名即可。

运行后，即可输出如下内容，正确的组合了问题的主体和动词，并获得了大模型的回应：
```json
{"roll":"pig","term":"eat","answer":"Pigs are omnivores, which means they eat a variety of foods. Their diet can include:\n\n1. **Grains and cereals**: Corn, barley, wheat, and oats are common.\n2. **Vegetables**: Such as potatoes, pumpkins, carrots, and leafy greens.\n3. **Fruits**: Like apples, pears, and grapes.\n4. **Protein**: Pigs can eat meat or fish protein, though this is more common in wild or non-commercial settings.\n5. **Root crops**: Such as sweet potatoes and turnips.\n6. **Commercial pig feed**: Specially formulated feeds provide balanced nutrition.\n   \nIt's important to ensure that pigs receive a balanced diet that suits their nutritional needs, avoiding foods that could be harmful, such as chocolate, excessive salt, or spoiled food."}
{"roll":"tiger","term":"chase","answer":"Tigers, being carnivorous predators, primarily chase ungulate prey such as deer, wild boar, and antelope. In the wild, their hunting behavior is focused on stalking and ambushing these animals. While they do not \"chase\" in the same way some other predators might, they pursue their prey with stealth and speed when the opportunity arises. Additionally, tigers can be curious and may sometimes chase smaller animals or movements, especially if they are perceived as threatening or intriguing."}
{"roll":"people","term":"drink","answer":"People's preferences for drinks vary widely based on individual tastes, cultures, and contexts. Here are some popular types of beverages that people enjoy:\n\n1. **Water**: Essential for hydration, it's the most consumed beverage worldwide.\n2. **Coffee**: Enjoyed for its stimulating effects, and available in numerous varieties like espresso, latte, cappuccino, etc.\n3. **Tea**: A popular choice across many cultures, available in varieties like black, green, herbal, and more.\n4. **Soft Drinks**: Carbonated beverages like cola, lemon-lime sodas, and root beer.\n5. **Juices**: Fruit and vegetable juices such as orange juice, apple juice, and carrot juice.\n6. **Alcoholic Beverages**: Beer, wine, spirits, and cocktails are popular choices for social or leisure activities.\n7. **Milk**: Consumed plain or flavored, and derived from various sources such as cows, almonds, soy, and oats.\n8. **Smoothies**: Blended fruit or vegetable drinks, often mixed with yogurt or milk.\n9. **Sports Drinks**: Formulated to rehydrate and replenish electrolytes, popular among athletes.\n10. **Energy Drinks**: Consumed for a quick energy boost, containing caffeine and other stimulants.\n\nPreferences can also be influenced by factors like age, health considerations, and seasonal changes."}
{"roll":"bird","term":"dance","answer":"The phrase \"a bird likes to dance\" can refer to playful or energetic bird behavior that resembles dancing, often seen during courtship displays. For example, certain birds like the male Lyrebird or Peacock perform elaborate dances to attract mates. These dances involve specific movements, poses, and sometimes rhythmic steps.\n\nIn a metaphorical or humorous context, \"a bird dancing\" could also refer to animated behavior like hopping, wing flapping, or head bobbing, often seen in parrots and other social birds, especially when they are excited or responding to music.\n\nIf you're referring to a specific bird character or a cultural reference, let me know, and I can provide more detailed information."}

```

## 解析

对于算子`FormatStrPromptedGenerator`和名为`FormatStrPrompt`的`prompt_template`，可以看到他们的关系是强耦合的。具体到源码内部看：


Prompt模板实现：
```python
from dataflow.utils.registry import PROMPT_REGISTRY
from dataflow.core.prompt import PromptABC

@PROMPT_REGISTRY.register()
class FormatStrPrompt(PromptABC):
    """
    Only the f_str_template needs to be provided.
    - Automatically parses the required fields from the template (self.fields)
    - build_prompt(**kwargs) renders directly using kwargs
    - on_missing: 'raise' | 'empty', controls behavior when fields are missing
    """
    def __init__(self, f_str_template: str = "{input_text}", on_missing: str = "raise"):
        self.f_str_template = f_str_template
        if on_missing not in ("raise", "empty"):
            raise ValueError("on_missing must be 'raise' or 'empty'")
        self.on_missing = on_missing

    def build_prompt(self, need_fields, **kwargs):
        # Validate missing fields
        missing = [f for f in need_fields if f not in kwargs]
        if missing:
            if self.on_missing == "raise":
                raise KeyError(f"Missing fields for prompt: {missing}")
            # Lenient mode: fill missing fields with empty strings 
            for f in missing:
                kwargs[f] = ""
        
        prompt = self.f_str_template
        for key, value in kwargs.items():
            prompt = prompt.replace(f"{{{key}}}", str(value))
        return prompt
```


算子实现：
```python 
import pandas as pd
from dataflow.utils.registry import OPERATOR_REGISTRY
from dataflow import get_logger
import string

from dataflow.utils.storage import DataFlowStorage
from dataflow.core import OperatorABC
from dataflow.core import LLMServingABC
from dataflow.core.prompt import prompt_restrict, PromptABC, DIYPromptABC
from typing import Union, Any, Set

from dataflow.prompts.core_text import FormatStrPrompt
@prompt_restrict(
    FormatStrPrompt,
)
@OPERATOR_REGISTRY.register()
class FormatStrPromptedGenerator(OperatorABC):
    def __init__(
            self,
            llm_serving: LLMServingABC, 
            system_prompt: str =  "You are a helpful agent.",
            prompt_template: Union[FormatStrPrompt, DIYPromptABC] = FormatStrPrompt,
            json_schema: dict = None,
        ):
        self.logger = get_logger()
        self.llm_serving = llm_serving
        self.system_prompt = system_prompt
        self.prompt_template = prompt_template
        self.json_schema = json_schema
        if prompt_template is None:
            raise ValueError("prompt_template cannot be None")

    def run(
            self, 
            storage: DataFlowStorage,
            output_key: str = "generated_content",
            **input_keys: Any
        ):
        self.storage: DataFlowStorage = storage
        self.output_key = output_key
        self.logger.info("Running PromptTemplatedGenerator...")
        self.input_keys = input_keys
        need_fields = set(input_keys.keys())
    # Load the raw dataframe from the input file
        dataframe = storage.read('dataframe')
        self.logger.info(f"Loading, number of rows: {len(dataframe)}")
        llm_inputs = []

        for idx, row in dataframe.iterrows():
            key_dict = {}
            for key in need_fields:
                key_dict[key] = row[input_keys[key]]
            prompt_text = self.prompt_template.build_prompt(need_fields, **key_dict)
            llm_inputs.append(prompt_text)
        self.logger.info(f"Prepared {len(llm_inputs)} prompts for LLM generation.")
        # Create a list to hold all generated contents
        # Generate content using the LLM serving
        generated_outputs = self.llm_serving.generate_from_input(user_inputs = llm_inputs, system_prompt = self.system_prompt, json_schema = self.json_schema)

        dataframe[self.output_key] = generated_outputs

        output_file = self.storage.write(dataframe)
        return output_key
```

可以看到Prompt模板和算子有如下特征：
1. **prompt模板和算子逻辑强绑定**：所有的算子均会调用其对应的`prompt_template`的`build_prompt`函数，但DataFlow框架并不限制这个过程中算子向该函数传递的参数类型和数量。只要算子和相应的所有`prompt_template`的调用方式自洽即可。这样可以尽可能发挥`定制化`的能力，实现各种算子来满足多种需求。
2. **通过装饰器构建映射**： 算子定义时，通过`@prompt_restrict(FormatStrPrompt)`来强制限制这个算子的`prompt_template`输入模板只能是`FormatStrPrompt`，DataFlow框架会对此进行额外的约束和检查。特别的，这里可以看到，任何继承了`DIYPromptABC`的prompt模板也被允许输入这里，这主要是方便用户在脚本中自己仿写一个prompt模板并直接定义在script里面；与之相对，默认情况下只有官方定义的prompt模板才继承`PromptABC`，并被严格检查。
3. **Prompt 模板负责“字符串构建”，算子负责“数据驱动”**

   * `FormatStrPrompt` 的职责非常单一：
     👉 根据 `need_fields` 和 `kwargs`，把数据渲染成一个最终的 Prompt 字符串
   * `FormatStrPromptedGenerator` 的职责则是：

     * 从 `DataFrame` 中逐行读取数据
     * 按照 `input_*` 的映射规则抽取字段
     * 将字段传入 Prompt 模板
     * 调用 LLM 并把结果写回数据集
   * 二者通过 `build_prompt()` 这个极小的接口完成解耦，而不是让 Prompt 直接感知数据结构

4. **Prompt 模板本身不感知“列名”，算子才感知**

   * Prompt 模板只关心：

     ```text
     我需要哪些变量？这些变量叫什么名字？
     ```
   * 真实的数据列名（如 `role`、`term`）只在算子的 `run()` 阶段才被绑定
   * 这也是为什么在 `run()` 中要显式传入：

     ```python
     input_role="role"
     input_term="term"
     ```
   * 这种设计让 Prompt 模板具备**跨数据集复用能力**

5. **“多对一”并不体现在模板本身，而体现在算子中**

   * `FormatStrPrompt` 本身并不知道：

     * 是一行数据
     * 还是多行数据
     * 是一列还是多列
   * 真正实现「多对一」的是算子这一段逻辑：

     ```python
     for idx, row in dataframe.iterrows():
         key_dict[key] = row[input_keys[key]]
         prompt_text = self.prompt_template.build_prompt(...)
     ```
   * 换句话说：
     👉 **Prompt 模板是“纯函数”，算子才是“批处理器”**

---

## 设计模式总结：为什么要这样设计？

通过这个例子，其实已经完整体现了 DataFlow 中 Prompt Template 的设计哲学：

### 1️⃣ Prompt 是“结构”，不是“文本”

* Prompt Template 不只是一个字符串
* 它是：

  * 可解析字段
  * 可校验缺失
  * 可被算子自动驱动的结构化对象

### 2️⃣ 算子 = Prompt Template + 数据驱动逻辑

可以用一句话概括：

> **算子决定“如何用 Prompt”，模板决定“Prompt 长什么样”**

这也是为什么在 DataFlow 中：

* Prompt Template 很少被设计成通用组件
* 而是**高度贴合算子的输入 / 输出逻辑**

---

## 什么时候需要自己写 Prompt Template？

新手在这里最容易困惑的是：

> 我到底是改 Prompt 字符串，还是要新写一个 Prompt Template？

可以用下面这个判断表：

| 场景                       | 是否需要自定义 Prompt Template      |
| ------------------------ | ---------------------------- |
| 只是改 Prompt 文案            | ❌ 不需要                        |
| 只是多传一列数据                 | ❌ 不需要（`FormatStrPrompt` 已支持） |
| Prompt 构建逻辑依赖条件分支        | ✅ 需要                         |
| Prompt 需要复杂后处理（拼表、排序、过滤） | ✅ 需要                         |
| Prompt 与算子逻辑强绑定，难以复用     | ✅ 需要                         |

👉 一句话总结：

> **当 Prompt 的“生成逻辑”已经不再是简单字符串替换时，就该写 Prompt Template 了**

---

## 本章小结

通过 `FormatStrPromptedGenerator` 这个核心算子，我们学习了：

* 如何在 DataFlow 中实现 **多列数据 → 单 Prompt → 单输出**
* Prompt Template 在 DataFlow 中的真实定位：

  * 不是“配置”
  * 而是“算子逻辑的一部分”
* 多对一 Prompt 的本质：

  * **模板负责格式**
  * **算子负责数据驱动**

这类设计模式在后续更复杂的 Pipeline（如信息抽取、结构化生成、链式推理）中会反复出现。

---

## 下一步你可以做什么？

建议你在继续阅读后续章节前，亲手尝试：

1. 在现有例子中加入第三列数据
2. 修改 `f_str_template`，观察 Prompt 与输出变化
3. 仿照 `FormatStrPrompt`，自己写一个最简单的 `DIYPromptABC`