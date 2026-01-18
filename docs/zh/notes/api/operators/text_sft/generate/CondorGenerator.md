---
title: CondorGenerator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_sft/generate/condorgenerator/
---

## 📘 概述
CondorGenerator 是一个两阶段合成 SFT (Supervised Fine-Tuning) 格式数据的算子。它基于预置的知识树标签，第一阶段生成不同难度级别的问题，第二阶段为每个问题生成对应的答案。该算子能够从零开始创建多样化的指令微调数据集。

## __init__函数
```python
def __init__(self, llm_serving: LLMServingABC = None, num_samples=15, use_task_diversity=True, prompt_template: Union[CondorQuestionPrompt, DIYPromptABC] = None):
```
### init参数说明
| 参数名 | 类型 | 默认值 | 说明 |
| :------------------ | :-------------- | :---------------------------- | :------------------------------ |
| **llm_serving** | LLMServingABC | None | 大语言模型服务实例，用于执行推理与生成。 |
| **num_samples** | int | 15 | 生成样本的总数。当数量较大（如大于5000）时，建议增加知识树标签以保证数据丰富度。 |
| **use_task_diversity** | bool | True | 是否使用预设的任务场景来增强生成问题的多样性。 |
| **prompt_template** | Union[CondorQuestionPrompt, DIYPromptABC] | True | 生成问题的prompt模板，支持自定义修改 |

### Prompt模板说明

默认prompt如下，根据预定义主题和领域生成问题。

```python
def build_prompt(self, theme, domain):
        """
        Generates the formatted prompt for LLM input based on the theme and domain.

        Parameters:
        theme (str): The main theme of the questions.
        domain (str): The domain under the given theme.

        Returns:
        str: The formatted prompt for generating questions.
        """
        prompt = f"""
Now we need to create high-quality SFT data for LLM training, so we need you to produce a batch of such data. You only
need to create Questions. I will give you a theme for SFT data Questions. You need to create three
Questions of different difficulty levels based on this new theme.\\
Your Questions must meet the following requirements:\\
1. You must strictly create only three Questions at a time. These three Questions must be in the domain of {domain}
and the Questions should align with the given theme of {theme}.\\
2. The Questions you create must have context and sufficient information; they should not be abrupt and directly ask the
question.\\
3. Your reply must strictly follow the format below. Your Questions need to be included between [Question Start] and
[Question End], and the difficulty level should be indicated at the beginning, as in the following format:\\

[Easy][Question Start]Question[Question End]

[Medium][Question Start]Question[Question End]

[Hard][Question Start]Question[Question End]

4. Your Questions of different difficulty levels should be distinct and actually reflect the different levels of difficulty.\\
\quad \\

Now it's your turn. Please provide the three Questions of different difficulty levels you created about the theme of {theme} for {domain}, according to the requirements.
"""
        return prompt
```

## run函数
```python
def run(self, storage: DataFlowStorage):
```
#### 参数
| 名称 | 类型 | 默认值 | 说明 |
| :------------- | :---------------- | :---------------- | :----------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |

## 🧠 示例用法

```python
from dataflow.operators.text_sft.generate import CondorGenerator
from dataflow.utils.storage import FileStorage
from dataflow.utils.llm_serving import APILLMServing_request

# 准备存储用于生成的 SFT 数据
storage = FileStorage(first_entry_file_name="../example_data/GeneralTextPipeline/empty.jsonl")

# 初始化 LLM 服务
llm_serving = APILLMServing_request(
    api_url="http://<your_llm_api_endpoint>",
    model_name="<your_model_name>",
)

# 初始化并运行算子
generator = CondorGenerator(
    llm_serving=llm_serving,
    num_samples=15,  # 要生成的 SFT 样本总数
)
generator.run(storage.step())
```

#### 🧾 输出格式

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| difficulty | str | 问题的难度级别（例如 "Easy", "Medium", "Hard"）。 |
| instruction | str | 生成的问题文本。 |
| output | str | 为对应指令生成的答案。 |

**示例输出：**
```json
{
  "difficulty": "Easy",
  "instruction": "Imagine you're starting your study abroad journey in a new country. What are three essential steps you need to take upon arrival to ensure a smooth transition into overseas living? Consider aspects such as accommodation, communication, and local registration.",
  "output": "Embarking on a study abroad journey is an exciting opportunity, and taking the right steps upon arrival can greatly aid in a smooth transition. Here are three essential steps to consider:\n\n1. **Secure and Settle into Accommodation:**\n   - **Confirmation and Check-in:** If you've arranged accommodation before arrival, ensure you have confirmation details and know the check-in procedures. If not, you should prioritize finding suitable temporary housing, like a hostel or hotel, while exploring long-term options such as student housing, apartments, or homestays.\n   - **Familiarize Yourself with the Area:** Once settled, get to know the neighborhood. Locate the nearest grocery store, pharmacy, public transportation stops, and other essential services.\n\n2. **Establish Communication:**\n   - **Local SIM Card and Mobile Plan:** Purchase a local SIM card to enable cost-effective communication. Ensure your phone is unlocked if you're planning to switch SIMs. Choose a mobile plan that suits your needs, whether that's data-heavy or voice-focused.\n   - **Internet Access:** Set up internet access in your accommodation if it is not already provided. Reliable internet is crucial for communication, study, and staying connected with family and friends.\n\n3. **Complete Local Registration and Administrative Obligations:**\n   - **University Registration:** Visit your university's international office for orientation and registration. Complete all necessary administrative tasks such as enrollment, student ID collection, and participation in orientation programs designed for international students.\n   - **Local Authorities Registration:** Some countries require international students to register with local authorities within a certain timeframe after arrival. This might involve visiting a local town hall, police station, or immigration office to register your residency. Check with your university or host country's regulations to ensure compliance.\n\nTending to these tasks ensures you have a solid foundation for your time abroad, positioning you well for a successful and enriching experience."
}
```
