---
title: Quick Start - Many-to-One Prompt Template
createTime: 2025/12/29 12:06:02
permalink: /en/guide/second_pipeline/
icon: solar:flag-2-broken
---

# Quick Start - Many-to-One Prompt Template

## Overview

In this chapter, you will get hands-on experience with how to use Prompt Templates. Previously, we introduced `PromptedGenerator`. To lower the learning barrier, it does not use a prompt template—instead, it accepts a plain Python string as a parameter. This makes it easy to use and allows it to serve as a basic, foundational operator.

Next, we will explore the real strengths and usage patterns of `prompt_template` in DataFlow.

## Characteristics of Prompt Templates

In many cases, a Prompt requires not only information passed at operator initialization time, but also needs to be assembled from key-value pairs within a dataset, followed by additional post-processing before being sent to an LLM. Therefore, prompt templates in DataFlow have the following characteristics:

1. In DataFlow, almost only `PromptedGenerator` directly takes a Python string as `system_prompt`. Most other operators hold an instance of a `prompt_template` class as a member.
2. Some operators encourage users to modify and reuse `prompt_template`, so they expose a `prompt_template` parameter in `__init__` to accept user-provided templates. Other operators do not want their prompts modified, so their `prompt_template` instances are hard-coded internally and no public interface is provided for direct modification.
3. The relationship between `prompt_template -> Operator` is either many-to-one or one-to-one.
4. In most cases, the logic of a `prompt_template` is coupled with the operator, so a `prompt_template` typically serves only one operator.
5. Due to the many-to-one relationship and tight coupling, if users implement their own `prompt_template` to reuse an operator, they need to refer to existing `prompt_template` logic as a blueprint.

## Example: Multi-Column Input

Here we use a very important core operator in `core_text`, `FormatStrPromptedGenerator`, as an example. The full example is located in
[double_column_input.py](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/statics/playground/playground/format_str_prompt_generator/double_column_input.py),
the operator definition is in
[format_str_prompted_generator.py](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/core_text/generate/format_str_prompted_generator.py),
and the prompt template definition is in
[FormatStrPrompt class definition](https://github.com/OpenDCAI/DataFlow/blob/668f03c7a810473a67a3646218849f48e1ebc209/dataflow/prompts/core_text.py#L5).

> Operators under the `core_text` category showcase the core usage patterns and design logic of the DataFlow kernel. Beginners are strongly encouraged to study these first. Other pipelines are built upon the design patterns established by these operators.

---

Assume we have the following multi-column data as input:

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
````

We want to combine each role with its corresponding verb to form a question, and then ask the LLM. This cannot be done using the earlier `PromptedGenerator`, because it only supports single-column input and single-column output. Here, we need to read multiple columns from the dataset and assemble them into a Prompt for the LLM.

To achieve this, we construct the following pipeline. Pay special attention to the highlighted parts:

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

The usage logic of this operator and its prompt template is:

1. Build a `FormatStrPrompt` instance containing a Python Format String as the operator's prompt template.
2. Pass the prompt template to the `prompt_template` parameter of `FormatStrPromptedGenerator` to initialize the operator.
3. In the operator's `run()` function, pass the dataset column names corresponding to the Format String fields, establishing a mapping between the template and the input data. The `run()` parameters have the following characteristics:

   1. The key-value pairs of parameters are used to build the mapping:

      * key: the variable name used in `f_str_template`
      * value: the actual column field name in the dataset
   2. This operator uses a variadic parameter list. Any parameter name starting with the prefix `input_*` will be matched. If you need to combine three columns, simply pass three parameters and write the corresponding variable names correctly in `f_str_template`.

After running, the output looks like the following. The subject and verb are correctly combined, and the LLM responses are produced:

```json
{"roll":"pig","term":"eat","answer":"Pigs are omnivores, which means they eat a variety of foods. Their diet can include:\n\n1. **Grains and cereals**: Corn, barley, wheat, and oats are common.\n2. **Vegetables**: Such as potatoes, pumpkins, carrots, and leafy greens.\n3. **Fruits**: Like apples, pears, and grapes.\n4. **Protein**: Pigs can eat meat or fish protein, though this is more common in wild or non-commercial settings.\n5. **Root crops**: Such as sweet potatoes and turnips.\n6. **Commercial pig feed**: Specially formulated feeds provide balanced nutrition.\n   \nIt's important to ensure that pigs receive a balanced diet that suits their nutritional needs, avoiding foods that could be harmful, such as chocolate, excessive salt, or spoiled food."}
{"roll":"tiger","term":"chase","answer":"Tigers, being carnivorous predators, primarily chase ungulate prey such as deer, wild boar, and antelope. In the wild, their hunting behavior is focused on stalking and ambushing these animals. While they do not \"chase\" in the same way some other predators might, they pursue their prey with stealth and speed when the opportunity arises. Additionally, tigers can be curious and may sometimes chase smaller animals or movements, especially if they are perceived as threatening or intriguing."}
{"roll":"people","term":"drink","answer":"People's preferences for drinks vary widely based on individual tastes, cultures, and contexts. Here are some popular types of beverages that people enjoy:\n\n1. **Water**: Essential for hydration, it's the most consumed beverage worldwide.\n2. **Coffee**: Enjoyed for its stimulating effects, and available in numerous varieties like espresso, latte, cappuccino, etc.\n3. **Tea**: A popular choice across many cultures, available in varieties like black, green, herbal, and more.\n4. **Soft Drinks**: Carbonated beverages like cola, lemon-lime sodas, and root beer.\n5. **Juices**: Fruit and vegetable juices such as orange juice, apple juice, and carrot juice.\n6. **Alcoholic Beverages**: Beer, wine, spirits, and cocktails are popular choices for social or leisure activities.\n7. **Milk**: Consumed plain or flavored, and derived from various sources such as cows, almonds, soy, and oats.\n8. **Smoothies**: Blended fruit or vegetable drinks, often mixed with yogurt or milk.\n9. **Sports Drinks**: Formulated to rehydrate and replenish electrolytes, popular among athletes.\n10. **Energy Drinks**: Consumed for a quick energy boost, containing caffeine and other stimulants.\n\nPreferences can also be influenced by factors like age, health considerations, and seasonal changes."}
{"roll":"bird","term":"dance","answer":"The phrase \"a bird likes to dance\" can refer to playful or energetic bird behavior that resembles dancing, often seen during courtship displays. For example, certain birds like the male Lyrebird or Peacock perform elaborate dances to attract mates. These dances involve specific movements, poses, and sometimes rhythmic steps.\n\nIn a metaphorical or humorous context, \"a bird dancing\" could also refer to animated behavior like hopping, wing flapping, or head bobbing, often seen in parrots and other social birds, especially when they are excited or responding to music.\n\nIf you're referring to a specific bird character or a cultural reference, let me know, and I can provide more detailed information."}
```

## Analysis

For the operator `FormatStrPromptedGenerator` and the `prompt_template` named `FormatStrPrompt`, we can see they are tightly coupled. Looking at the source code:

Prompt template implementation:

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

Operator implementation:

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

From this, we can summarize the following characteristics of prompt templates and operators:

1. **Prompt templates are strongly bound to operator logic**: Every operator calls the corresponding `prompt_template.build_prompt()` function, but the DataFlow framework does not restrict the types or number of arguments passed in this process. As long as the operator and all corresponding `prompt_template` call patterns are self-consistent, it works. This maximizes customization, enabling operators to satisfy diverse needs.

2. **Mappings are enforced via decorators**: When defining an operator, `@prompt_restrict(FormatStrPrompt)` forces the `prompt_template` input to be limited to `FormatStrPrompt`. DataFlow adds additional constraints and checks. Notably, any prompt template inheriting `DIYPromptABC` is also allowed—this is mainly to let users quickly implement a custom prompt template in a script without registering it officially. In contrast, by default, only official prompt templates inherit `PromptABC` and are strictly validated.

3. **The prompt template is responsible for "string construction", while the operator is responsible for "data driving"**

   * The responsibility of `FormatStrPrompt` is very narrow:
     👉 Render the final Prompt string based on `need_fields` and `kwargs`.
   * The responsibility of `FormatStrPromptedGenerator` includes:

     * Read data row by row from a `DataFrame`
     * Extract fields according to the `input_*` mapping rules
     * Pass fields into the Prompt template
     * Call the LLM and write the results back to the dataset
   * They are decoupled through a minimal interface `build_prompt()`, rather than letting the prompt directly depend on dataset structure.

4. **The prompt template does not know column names; only the operator does**

   * The prompt template only cares about:

     ```text
     What variables do I need? What are their names?
     ```
   * Real dataset column names (e.g., `role`, `term`) are only bound during the operator's `run()` stage.
   * This is why `run()` must explicitly pass:

     ```python
     input_role="role"
     input_term="term"
     ```
   * This design enables the prompt template to be reusable across datasets.

5. **"Many-to-one" is not reflected in the template itself, but in the operator**

   * `FormatStrPrompt` itself does not know whether it is dealing with:

     * a single row or multiple rows
     * a single column or multiple columns
   * The logic that truly realizes "many-to-one" is inside the operator:

     ```python
     for idx, row in dataframe.iterrows():
         key_dict[key] = row[input_keys[key]]
         prompt_text = self.prompt_template.build_prompt(...)
     ```
   * In other words:
     👉 **The prompt template is a "pure function", while the operator is the "batch processor".**

---

## Design Pattern Summary: Why This Design?

This example fully demonstrates the design philosophy of Prompt Templates in DataFlow:

### 1️⃣ A Prompt is "Structure", Not Just "Text"

* A Prompt Template is not merely a string.
* It is a structured object that can:

  * expose/parse fields
  * validate missing values
  * be automatically driven by operators

### 2️⃣ Operator = Prompt Template + Data-Driving Logic

This can be summarized in one sentence:

> **The operator decides how to use the Prompt; the template decides what the Prompt looks like.**

This is also why in DataFlow:

* Prompt Templates are rarely designed as universal components
* Instead, they are **highly aligned with operator input/output logic**

---

## When Should You Write Your Own Prompt Template?

The most common confusion for beginners is:

> Should I just modify the Prompt string, or should I write a new Prompt Template?

Use the following checklist:

| Scenario                                                    | Do you need a custom Prompt Template?        |
| ----------------------------------------------------------- | -------------------------------------------- |
| Only changing prompt wording                                | ❌ No                                         |
| Just adding one more input column                           | ❌ No (`FormatStrPrompt` already supports it) |
| Prompt construction requires conditional branches           | ✅ Yes                                        |
| Prompt needs complex post-processing (merge, sort, filter)  | ✅ Yes                                        |
| Prompt is tightly bound to operator logic and hard to reuse | ✅ Yes                                        |

👉 One-sentence summary:

> **When the "generation logic" of your Prompt is no longer simple string substitution, it's time to write a Prompt Template.**

---

## Chapter Summary

With the core operator `FormatStrPromptedGenerator`, we learned:

* How to implement **multiple columns → single Prompt → single output** in DataFlow
* The real role of Prompt Templates in DataFlow:

  * not just "configuration"
  * but part of the operator's logic
* The essence of a many-to-one Prompt:

  * **Templates handle formatting**
  * **Operators handle data driving**

This design pattern will repeatedly appear in more complex pipelines (e.g., information extraction, structured generation, chain-of-thought style workflows).

---

## What to Try Next

Before moving to the next chapter, it is recommended to try:

1. Add a third column to the existing example
2. Modify `f_str_template` and observe how the Prompt and output change
3. Mimic `FormatStrPrompt` and write the simplest possible `DIYPromptABC`

```
```
