---
title: AlpagasusFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_sft/filter/alpagasusfilter/
---

## 📘 概述

[AlpagasusFilter](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/reasoning/generate/reasoning_answer_generator.py) 是一个基于 AlpagasusScorer 打分器的数据过滤算子。它通过调用大语言模型（LLM）来评估输入数据的质量，并根据预设的分数范围筛选出符合条件的数据。

## __init__函数

```python
def __init__(self, min_score=3, max_score=5, llm_serving: LLMServingABC = None, dimension='quality')
```

| 参数名 | 类型 | 默认值 | 说明 |
| :-------------- | :-------------- | :------------ | :----------------------- |
| **min_score** | int | 3 | 最低分数阈值。 |
| **max_score** | int | 5 | 最高分数阈值。 |
| **llm_serving** | LLMServingABC | None | 大语言模型服务实例。 |
| **dimension** | str | 'quality' | 评估维度，默认为'quality'（质量）。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :---------------- | :------- | :------- | :------- |
|                   |          |          |          |

## run函数

```python
def run(self, storage: DataFlowStorage, input_instruction_key: str, input_input_key: str, input_output_key: str, output_key: str='AlpagasusScore')
```

| 名称 | 类型 | 默认值 | 说明 |
| :---------------------- | :---------------- | :----------------- | :----------------------------- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input_instruction_key** | str | 必需 | 包含指令的输入列名。 |
| **input_input_key** | str | 必需 | 包含输入内容的输入列名。 |
| **input_output_key** | str | 必需 | 包含输出内容的输入列名。 |
| **output_key** | str | 'AlpagasusScore' | 存储分数的输出列名。 |

## 🧠 示例用法

```python
from dataflow.operators.text_sft.filter import AlpagasusFilter
from dataflow.utils.storage import FileStorage
from dataflow.utils.llm_serving import APILLMServing_request

# 准备包含 SFT 格式数据的存储
storage = FileStorage(first_entry_file_name="sft_data.jsonl")

# 初始化 LLM 服务
llm_serving = APILLMServing_request(
    api_url="http://<your_llm_api_endpoint>",
    model_name="<your_model_name>",
)

# 初始化并运行过滤器
alp_filter = AlpagasusFilter(
    min_score=3,
    max_score=5,
    llm_serving=llm_serving,
    dimension="quality",
)
alp_filter.run(
    storage.step(),
    input_instruction_key="instruction",
    input_input_key="input",
    input_output_key="output",
    output_key="AlpagasusScore",
)
```

#### 🧾 默认输出格式（Output Format）

| 字段 | 类型 | 说明 |
| :---------------- | :---- | :------------------------------------------- |
| ... | ... | 输入数据中的原始字段。 |
| AlpagasusScore | int | 模型生成的质量分数（输出列名可通过 `output_key` 参数修改）。 |

**示例输入：**
```json
{
    "difficulty":"Easy",
    "instruction":"Imagine you are a school counselor tasked with promoting mental health among high school students. What are some basic steps you can take to create an environment that reduces the risk of psychological disorders among students? Consider actions such as organizing workshops or creating a supportive atmosphere.",
    "output":"Creating an environment that supports mental health and reduces the risk of psychological disorders among high school students requires a thoughtful and collaborative approach. Here are some steps a school counselor might take, along with practical examples and considerations for implementation:\n\n1. **Educate and Raise Awareness:**\n   - Organize workshops and seminars using successful models like the "Mind Matters Program," which provides engaging sessions on stress management and coping skills. Partnering with local mental health organizations for expertise can enhance effectiveness.\n   - Use real-life stories and testimonials to normalize discussions around mental health and demonstrate that seeking help is a sign of strength.\n\n2. **Promote a Supportive Atmosphere:**\n   - Coordinate with teachers to implement inclusive classroom strategies, such as restorative circles or regular \"check-in\" moments, where students can openly share their feelings.\n   - Establish a peer support program, like a "Student Circle" where senior students mentor juniors, fostering a community of encouragement.\n\n3. **Provide Access to Resources:**\n   - Set up easy-access resources, such as a digital platform or app where students can find mental health information and local services. Collaborate with tech-savvy students or local developers for creation and maintenance.\n   - Introducing a virtual counseling option could cater to students who prefer more privacy when reaching out for help.\n\n4. **Develop and Implement Policies:**\n   - Work closely with the school's administration to craft and promote anti-bullying and mental health policies. Regularly update students on these policies through assemblies and classroom discussions.\n   - Creating a taskforce involving teachers, admin, and student leaders can ensure diverse perspectives and smoother policy implementation.\n\n5. **Incorporate Mental Health into the Curriculum:**\n   - Advocate for integrating emotional and social learning into existing classes. The use of programs like CASEL's SEL (Social Emotional Learning) framework can offer structure and resources for this integration.\n   - Providing teachers with training sessions on SEL can help them seamlessly incorporate into their teaching practices.\n\n6. **Engage Parents and Guardians:**\n   - Hold educational workshops for parents, focusing on understanding adolescent mental health and enhancing family communication. Using case studies from successful family engagement initiatives can illustrate impact and provide reassurance.\n   - Implement regular updates via newsletters that provide ongoing tips and strategies for parents to support their children.\n\n7. **Create Relaxation Spaces:**\n   - Explore partnerships with local businesses or artists to create inviting relaxation zones using minimal resources. For example, a student-led group could organize a "Zen Corner" with donated items.\n   - Share data on the mental health benefits of such spaces to justify allocation of existing school space.\n\n8. **Regular Check-ins:**\n   - Plan regular one-on-one or group check-ins. Using structured formats, such as a "Mood Meter" or guided journal prompts, can help facilitate meaningful dialogue.\n   - Encourage teachers to adopt short weekly emotional check-ins in classes to create consistency across student experiences.\n\nPrioritizing steps involves assessing the school's current needs and resources, and initially focusing on foundational actions like early education and resource access. Collaborating with school leadership ensures alignment and fosters support, and addressing potential challenges fortifies initiatives against setbacks.\n\nBy implementing these strategies and involving the broader community, a school counselor can effectively cultivate a nurturing environment that champions mental health and mitigates psychological distress among students."
}
```
**示例输出（如果通过过滤器）：**
```json
{
    "difficulty":"Easy",
    "instruction":"Imagine you are a school counselor tasked with promoting mental health among high school students. What are some basic steps you can take to create an environment that reduces the risk of psychological disorders among students? Consider actions such as organizing workshops or creating a supportive atmosphere.",
    "output":"Creating an environment that supports mental health and reduces the risk of psychological disorders among high school students requires a thoughtful and collaborative approach. Here are some steps a school counselor might take, along with practical examples and considerations for implementation:\n\n1. **Educate and Raise Awareness:**\n   - Organize workshops and seminars using successful models like the "Mind Matters Program," which provides engaging sessions on stress management and coping skills. Partnering with local mental health organizations for expertise can enhance effectiveness.\n   - Use real-life stories and testimonials to normalize discussions around mental health and demonstrate that seeking help is a sign of strength.\n\n2. **Promote a Supportive Atmosphere:**\n   - Coordinate with teachers to implement inclusive classroom strategies, such as restorative circles or regular \"check-in\" moments, where students can openly share their feelings.\n   - Establish a peer support program, like a "Student Circle" where senior students mentor juniors, fostering a community of encouragement.\n\n3. **Provide Access to Resources:**\n   - Set up easy-access resources, such as a digital platform or app where students can find mental health information and local services. Collaborate with tech-savvy students or local developers for creation and maintenance.\n   - Introducing a virtual counseling option could cater to students who prefer more privacy when reaching out for help.\n\n4. **Develop and Implement Policies:**\n   - Work closely with the school's administration to craft and promote anti-bullying and mental health policies. Regularly update students on these policies through assemblies and classroom discussions.\n   - Creating a taskforce involving teachers, admin, and student leaders can ensure diverse perspectives and smoother policy implementation.\n\n5. **Incorporate Mental Health into the Curriculum:**\n   - Advocate for integrating emotional and social learning into existing classes. The use of programs like CASEL's SEL (Social Emotional Learning) framework can offer structure and resources for this integration.\n   - Providing teachers with training sessions on SEL can help them seamlessly incorporate into their teaching practices.\n\n6. **Engage Parents and Guardians:**\n   - Hold educational workshops for parents, focusing on understanding adolescent mental health and enhancing family communication. Using case studies from successful family engagement initiatives can illustrate impact and provide reassurance.\n   - Implement regular updates via newsletters that provide ongoing tips and strategies for parents to support their children.\n\n7. **Create Relaxation Spaces:**\n   - Explore partnerships with local businesses or artists to create inviting relaxation zones using minimal resources. For example, a student-led group could organize a "Zen Corner" with donated items.\n   - Share data on the mental health benefits of such spaces to justify allocation of existing school space.\n\n8. **Regular Check-ins:**\n   - Plan regular one-on-one or group check-ins. Using structured formats, such as a "Mood Meter" or guided journal prompts, can help facilitate meaningful dialogue.\n   - Encourage teachers to adopt short weekly emotional check-ins in classes to create consistency across student experiences.\n\nPrioritizing steps involves assessing the school's current needs and resources, and initially focusing on foundational actions like early education and resource access. Collaborating with school leadership ensures alignment and fosters support, and addressing potential challenges fortifies initiatives against setbacks.\n\nBy implementing these strategies and involving the broader community, a school counselor can effectively cultivate a nurturing environment that champions mental health and mitigates psychological distress among students.",
    "AlpagasusScore":5.0
}
```
