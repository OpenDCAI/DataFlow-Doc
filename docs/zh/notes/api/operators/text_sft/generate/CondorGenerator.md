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

## 示例用法

示例合成数据

```json
{
    "difficulty":"Easy",
    "instruction":"Imagine you're visiting a country where the custom is to greet others with a bow instead of a handshake. As a traveler aiming to adapt culturally, how would you approach your first meeting with locals to show respect for their traditions? How might you prepare before your trip to ensure you understand this and other greeting customs?",
    "output":"Adapting to local customs when visiting a new country is a respectful and enriching approach. Here’s how you might approach your first meeting with locals to show respect for their tradition of greeting with a bow:\n\n1. **Preparation Before the Trip:**\n   - **Research Cultural Practices:** Begin by researching the social norms and customs specific to the country you are visiting. This can include watching videos, reading travel guides, and exploring reputable online resources that describe local etiquette.\n   - **Understand the Bowing Gesture:** Learn the different forms and depths of bowing, as some cultures have variations based on the social context or the status of the person you are greeting.\n   - **Learn the Language Basics:** Familiarize yourself with basic greetings and polite phrases in the local language, which will enhance your sincerity in adapting to their customs.\n   - **Connect with Locals:** If possible, reach out to locals or expatriate communities online to gather insights or tips on cultural norms and expectations.\n\n2. **During the Meeting:**\n   - **Observe and Mimic:** Upon meeting someone for the first time, observe how they initiate the greeting, the depth of their bow, and then respectfully mimic their approach.\n   - **Display Body Language that Conveys Openness:** Maintain good posture, smile genuinely, and make eye contact where culturally appropriate to convey warmth and openness.\n   - **Offer a Polite Verbal Greeting:** Combine the physical gesture with a courteous verbal greeting in their language or a respectful equivalent.\n\n3. **Be Open to Feedback:**\n   - **Ask for Guidance:** If you are unsure about the proper etiquette, it is perfectly fine to politely ask if you are doing it correctly or request guidance on any cultural nuances.\n   - **Show Appreciation:** Express gratitude for any insights or corrections offered by locals, demonstrating your willingness to learn and respect their traditions.\n\nBy thoroughly preparing and demonstrating genuine respect during your interactions, you show appreciation for their culture and foster positive and meaningful connections."
}
```