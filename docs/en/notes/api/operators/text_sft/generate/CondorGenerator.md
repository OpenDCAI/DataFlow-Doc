---
title: CondorGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_sft/generate/condorgenerator/
---

## 📘 Overview
`CondorGenerator` is a two-stage operator for generating SFT (Supervised Fine-Tuning) formatted data. Based on predefined knowledge tree tags, it first generates questions of different difficulty levels, and then generates corresponding answers for each question. This operator can create diverse instruction fine-tuning datasets from scratch.

## `__init__`
```python
def __init__(self, llm_serving: LLMServingABC = None, num_samples=15, use_task_diversity=True, prompt_template: Union[CondorQuestionPrompt, DIYPromptABC] = None):
```
### init Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | None | The Large Language Model serving instance, used to execute inference and generation. |
| **num_samples** | int | 15 | Total number of samples to generate. When the number is large (e.g., greater than 5000), it is recommended to increase the knowledge tree tags to ensure data richness. |
| **use_task_diversity** | bool | True | Whether to use predefined task scenarios to enhance the diversity of generated questions. |
| **prompt_template** | Union[CondorQuestionPrompt, DIYPromptABC] | None | Prompt template for generating questions, supports custom modifications |

### Prompt Template Description

The default prompt generates questions based on predefined themes and domains.

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

## `run`
```python
def run(self, storage: DataFlowStorage):
```
#### Parameters
| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | The DataFlowStorage instance, responsible for reading and writing data. |

## Example Usage

Example synthetic data

```json
{
    "difficulty":"Easy",
    "instruction":"Imagine you're visiting a country where the custom is to greet others with a bow instead of a handshake. As a traveler aiming to adapt culturally, how would you approach your first meeting with locals to show respect for their traditions? How might you prepare before your trip to ensure you understand this and other greeting customs?",
    "output":"Adapting to local customs when visiting a new country is a respectful and enriching approach. Here's how you might approach your first meeting with locals to show respect for their tradition of greeting with a bow:\n\n1. **Preparation Before the Trip:**\n   - **Research Cultural Practices:** Begin by researching the social norms and customs specific to the country you are visiting. This can include watching videos, reading travel guides, and exploring reputable online resources that describe local etiquette.\n   - **Understand the Bowing Gesture:** Learn the different forms and depths of bowing, as some cultures have variations based on the social context or the status of the person you are greeting.\n   - **Learn the Language Basics:** Familiarize yourself with basic greetings and polite phrases in the local language, which will enhance your sincerity in adapting to their customs.\n   - **Connect with Locals:** If possible, reach out to locals or expatriate communities online to gather insights or tips on cultural norms and expectations.\n\n2. **During the Meeting:**\n   - **Observe and Mimic:** Upon meeting someone for the first time, observe how they initiate the greeting, the depth of their bow, and then respectfully mimic their approach.\n   - **Display Body Language that Conveys Openness:** Maintain good posture, smile genuinely, and make eye contact where culturally appropriate to convey warmth and openness.\n   - **Offer a Polite Verbal Greeting:** Combine the physical gesture with a courteous verbal greeting in their language or a respectful equivalent.\n\n3. **Be Open to Feedback:**\n   - **Ask for Guidance:** If you are unsure about the proper etiquette, it is perfectly fine to politely ask if you are doing it correctly or request guidance on any cultural nuances.\n   - **Show Appreciation:** Express gratitude for any insights or corrections offered by locals, demonstrating your willingness to learn and respect their traditions.\n\nBy thoroughly preparing and demonstrating genuine respect during your interactions, you show appreciation for their culture and foster positive and meaningful connections."
}
```
