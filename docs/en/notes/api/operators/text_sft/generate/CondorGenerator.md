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

## 🧠 Example Usage
```python
from dataflow.operators.text_sft.generate import CondorGenerator
from dataflow.prompts.general_text import CondorQuestionPrompt
from dataflow.utils.storage import FileStorage
from dataflow.utils.llm_serving import APILLMServing_request

# Prepare storage for generated SFT data
storage = FileStorage(first_entry_file_name="../example_data/GeneralTextPipeline/empty.jsonl")

# Initialize LLM serving
llm_serving = APILLMServing_request(
    api_url="http://<your_llm_api_endpoint>",
    model_name="<your_model_name>",
)

# Initialize and run the operator
generator = CondorGenerator(
    llm_serving=llm_serving,
    num_samples=15,  # total number of SFT samples to generate
    prompt_template=CondorQuestionPrompt()
)
generator.run(storage.step())
```

#### 🧾 Output Format
| Field | Type | Description |
| :--- | :--- | :--- |
| difficulty | str | Difficulty level of the question (e.g., "Easy", "Medium", "Hard"). |
| instruction | str | The generated question text. |
| output | str | The generated answer for the corresponding instruction. |

**Example Output:**
```json
{
  "difficulty": "Easy",
  "instruction": "Imagine you're starting your study abroad journey in a new country. What are three essential steps you need to take upon arrival to ensure a smooth transition into overseas living? Consider aspects such as accommodation, communication, and local registration.",
  "output": "Embarking on a study abroad journey is an exciting opportunity, and taking the right steps upon arrival can greatly aid in a smooth transition. Here are three essential steps to consider:\n\n1. **Secure and Settle into Accommodation:**\n   - **Confirmation and Check-in:** If you've arranged accommodation before arrival, ensure you have confirmation details and know the check-in procedures. If not, you should prioritize finding suitable temporary housing, like a hostel or hotel, while exploring long-term options such as student housing, apartments, or homestays.\n   - **Familiarize Yourself with the Area:** Once settled, get to know the neighborhood. Locate the nearest grocery store, pharmacy, public transportation stops, and other essential services.\n\n2. **Establish Communication:**\n   - **Local SIM Card and Mobile Plan:** Purchase a local SIM card to enable cost-effective communication. Ensure your phone is unlocked if you're planning to switch SIMs. Choose a mobile plan that suits your needs, whether that's data-heavy or voice-focused.\n   - **Internet Access:** Set up internet access in your accommodation if it is not already provided. Reliable internet is crucial for communication, study, and staying connected with family and friends.\n\n3. **Complete Local Registration and Administrative Obligations:**\n   - **University Registration:** Visit your university's international office for orientation and registration. Complete all necessary administrative tasks such as enrollment, student ID collection, and participation in orientation programs designed for international students.\n   - **Local Authorities Registration:** Some countries require international students to register with local authorities within a certain timeframe after arrival. This might involve visiting a local town hall, police station, or immigration office to register your residency. Check with your university or host country's regulations to ensure compliance.\n\nTending to these tasks ensures you have a solid foundation for your time abroad, positioning you well for a successful and enriching experience."
}
```
