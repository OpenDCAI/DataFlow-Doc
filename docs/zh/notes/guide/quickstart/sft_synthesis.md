---
title: 案例2. SFT数据合成
createTime: 2025/7/15 14:19:16
permalink: /zh/guide/sft_synthesis/
icon: basil:lightning-alt-outline
---

# SFT数据合成

## 从0开始合成

### 第一步:安装dataflow环境
```shell
pip install open-dataflow
```
### 第二步:创建新的dataflow工作文件夹
```shell
mkdir run_dataflow
cd run_dataflow
```
### 第三步:初始化Dataflow
```shell
dataflow init
```
这时你会看见
```shell
run_dataflow/playground/text_sft_synthesis_from_scratch.py  
```
### 第四步:填入你的api key以及api_url
对于Linux和Mac OS
```shell
export DF_API_KEY="sk-xxxxx"
```

对于Windows
```powershell
$env:DF_API_KEY = "sk-xxxxx"
```
`text_sft_synthesis_from_scratch.py`中的api_url填写方式如下：
```python
self.llm_serving = APILLMServing_request(
        api_url="https://api.openai.com/v1/chat/completions",
        model_name="gpt-4o",
        max_workers=100
)
```

### 第五步:一键运行
```bash
python playground/text_sft_synthesis_from_scratch.py  
```

运行时，该流水线会先后调用[`CondorGenerator`](/zh/guide/lo3cyadt/), [`CondorRefiner`](/zh/guide/q07ou7d9/)和[`AlpagasusFilter`](/zh/guide/q07ou7d9/)，分别进行SFT数据合成、数据改写和数据质量过滤，最终数据会保存在`run_dataflow/cache`中。（可通过`self.num_generated_samples`参数改变合成数据数量，由于该流水线基于内置种子进行数据合成，为了数据多样性，建议设置合成数量小于5000，否则可在`dataflow.prompts.general_text.CondorPrompt`类中自行增加种子）

### 合成数据示例
```json
{
    "difficulty":"Easy",
    "instruction":"Religious policies can shape societies in numerous ways. One example is where policies for religious freedom allow diverse religions to coexist peacefully within a nation. Considering a country that recently implemented laws to ensure religious freedom for all its citizens, discuss some potential positive impacts these policies may have on social harmony and economic growth.",
    "output":"Implementing laws that ensure religious freedom can have several positive impacts on a country's social harmony and economic growth. However, it's important to also consider potential challenges and the steps necessary for realizing these benefits sustainably:\n\n1. **Social Harmony:**\n   - **Increased Tolerance and Understanding:** Religious freedom allows individuals to express their beliefs openly without fear of persecution. This can lead to greater tolerance and understanding among different religious communities, fostering social cohesion.\n   - **Reduction of Religious Conflicts:** By guaranteeing religious freedom, a country can reduce the likelihood of religious conflicts and tensions, promoting peace and stability within society. However, managing cultural differences requires ongoing dialogue and education to prevent deeply rooted prejudices from hindering social harmony.\n   - **Cultural Diversity and Enrichment:** The coexistence of diverse religious groups can enrich the cultural landscape of a nation, encouraging exchanges of ideas, traditions, and values that can enhance mutual respect and appreciation. Community engagement initiatives and educational programs can support this enrichment and ensure equitable treatment across all religious groups.\n\n2. **Economic Growth:**\n   - **Attracting Talent and Investment:** Religious freedom can make a country more attractive to international talent and investors who seek a stable and open environment to live and conduct business. This can lead to increased foreign direct investment and enhance the country's global economic standing. Governments and communities must actively promote inclusivity to maintain this attractiveness.\n   - **Boosting Tourism:** A reputation for religious inclusivity can boost tourism, as travelers often prefer destinations where diverse religious practices are respected. Religious festivals and sites can attract visitors, benefiting local economies. Policies ensuring safety and respect for all types of visitors are crucial for sustained tourism growth.\n   - **Encouraging Innovation and Entrepreneurship:** When individuals feel safe to express their beliefs and live according to their values, they are more likely to contribute positively to society. A diverse population can lead to a greater exchange of ideas, fostering innovation and creativity in business ventures and community projects. Long-term educational and community support systems are necessary to encourage continued innovation.\n\nTo provide a more comprehensive view, examining case studies of countries like Canada, which has successfully implemented religious freedom policies leading to vibrant multiculturalism and economic development, can offer valuable insights into strategies for sustaining these positive impacts.\n\nOverall, while laws promoting religious freedom can contribute to building a harmonious society and driving economic growth, acknowledging challenges and implementing supportive measures are essential for achieving and maintaining these benefits over time.",
    "AlpagasusScore":4.0
}
```

## 从用户输入数据合成

在工作文件夹中，你会看到
```shell
run_dataflow/playground/text_sft_synthesis_from_seed.py  
```
种子数据路径在`first_entry_file_name`中设置
```python
self.storage = FileStorage(
        first_entry_file_name="./example_data/GeneralTextPipeline/pt_input.jsonl",
        cache_path="./cache",
        file_name_prefix="dataflow_cache_step",
        cache_type="jsonl",
    )
```
同时，用户可以在`custom_prompt`中自定义数据合成相关需求。
```python
self.generator = SFTGeneratorSeed(llm_serving=llm_serving, custom_prompt="Try to make the question suitable for middle school students.")
```
### 一键运行
```bash
python playground/text_sft_synthesis_from_seed.py  
```
该流水线会调用[`SFTGeneratorSeed`](/zh/guide/lo3cyadt/)算子进行SFT数据合成。该算子通过种子文档输入，提取文档信息调用大模型API进行SFT数据合成，并支持通过`custom_prompt`参数添加用户自定义指令内容。

### 合成数据示例
其中，`raw_content`字段为原始种子数据。
```json
{
    "instruction":"How did Diccon Bewes and his mother compare their experiences while following Jemima Morrell's journey on the first Thomas Cook tour to Switzerland in 1863? Discuss the differences in travel methods and accommodations between the two trips.",
    "output":"Diccon Bewes and his mother compared their experiences by reading sections from Jemima Morrell's diary at each point in their journey. They noted differences such as travel methods—where Jemima traveled by rail, diligence, foot, mule, and steamship, Bewes used modern trains where possible—and accommodations, recognizing that many lodgings Jemima stayed at no longer existed or offered modern conveniences. They highlighted how travel time has been reduced and how the tourism industry, along with the physical environment, has changed drastically over the years.",
    "raw_content":"Slow Train to Switzerland\nFinished September 28\nSlow Train to Switzerland: One Tour, Two Trips, 150 Years -- and a World of Change Apart by Diccon Bewes\nI liked the premise of this book, following in the footsteps of an earlier journey. Diccon Bewes is a British travel writer who lives in Switzerland, and during research he came across a diary from a young Englishwoman, Jemima Morrell, who, as part of a group who called themselves the Junior United Alpine Club, travelled on the very first Thomas Cook tour to Switzerland in 1863. The group consisted of four young women and three young men, and included Jemima's brother William, who paid for both of them.\nBewes determined to follow as much as possible in her footsteps, following the route she took, staying in the same places and visiting the same sights as much as possible. Near the beginning of the book is a map of the Cook tour from 1863 which took place from June 26th to July 15th, and included travel by rail, diligence, foot, mule, and steamship. With Thomas Cook the company that launched modern mass tourism, and by the time I finished the book going into bankruptcy, this book looks at travel from an interesting vantage point. Bewes took the trip with his mother, going back to certain points at a later date on his own.\nAppendices include: a brief description of the world in 1863, and a timeline of that year showing some important events that occured; a summary, including data points of Switzerland in the 1860s with information on language spoken, size of towns, birth and death rates, wages and prices, and occupations; and descriptions and explanations on money of the time, both English and Swiss their modern equivalencies.\nAs he followed Jemima's journey, he and his mother read sections from the diary at each point in their journey, and while many of the lodgings that she stayed in no longer existed, a few did. Some sections of the journey are now done by train, where there weren't trains back then, and Jemima's journey definitely involved longer and more difficult travel times. Some of her days were exceedingly long, and many of the places she stayed didn't offer the modern conveniences now available.\nDewes shows the differences between the two experiences plainly, from the modes of travel, to the the time travelling took, to the things one was able to see at each point in the journey. He shows the huge changes that have taken place in the tourism industry in Switzerland, and talks about the drivers of those changes. He discusses changes to the physical environment, from the buildings and food on offer to the shrinking of the snow caps and glaciers. He follows up at the end with a look at what became of Jemima after this journey and the discovery of a personal connection to her family.\nThis was a fascinating and educational read, and hugely entertaining.\nLabels: History, Journeys, Memoirs, Switzerland, Travel, Writers\nNutcracker Night\nTears of Salt\nTriceratops Stomp\nThe Castle in the Sea\nThe Corner That Held Them\nMy Drowning\nA Better Man\nMurder in Passy\nBody Bereft\nMrs. Saint and the Defectives\n13th Canadian Book Challenge October Roundup"
}
```
