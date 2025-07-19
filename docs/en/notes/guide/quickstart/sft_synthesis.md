---
title: Case 2. SFT Data Synthesis
createTime: 2025/7/15 14:19:16
permalink: /en/guide/sft_synthesis/
icon: basil:lightning-alt-outline
---

# SFT Data Synthesis

## Generate from Scratch

### Step 1: Install the dataflow environment
```shell
pip install open-dataflow
```

### Step 2: Create a new dataflow workspace
```shell
mkdir run_dataflow
cd run_dataflow
```

### Step 3: Initialize Dataflow
```shell
dataflow init
```
You will then see:
```shell
run_dataflow/playground/text_sft_synthesis_from_scratch.py  
```

### Step 4: Enter your API key and API URL
For Linux and Mac OS:
```shell
export DF_API_KEY="sk-xxxxx"
```

For Windows:
```powershell
$env:DF_API_KEY = "sk-xxxxx"
```

In `text_sft_synthesis_from_scratch.py`, fill in the API URL as follows:
```python
self.llm_serving = APILLMServing_request(
        api_url="https://api.openai.com/v1/chat/completions",
        model_name="gpt-4o",
        max_workers=100
)
```

### Step 5: One-click Execution
```bash
python playground/text_sft_synthesis_from_scratch.py  
```

During execution, this pipeline will sequentially call [`CondorGenerator`](/en/guide/text_generate_operators/), [`CondorRefiner`](/en/guide/text_process_operators/), and [`AlpagasusFilter`](/en/guide/text_process_operators/) for SFT data generation, rewriting, and quality filtering. The final data will be saved in `run_dataflow/cache`. (You can change the number of generated samples using `self.num_generated_samples`. Since the pipeline uses built-in seeds for generation, it’s recommended to keep the number below 5000 for diversity. You can add more seeds in `dataflow.prompts.general_text.CondorPrompt` if needed.)

### Example of Generated Data
```json
{
    "difficulty":"Easy",
    "instruction":"Religious policies can shape societies in numerous ways. One example is where policies for religious freedom allow diverse religions to coexist peacefully within a nation. Considering a country that recently implemented laws to ensure religious freedom for all its citizens, discuss some potential positive impacts these policies may have on social harmony and economic growth.",
    "output":"Implementing laws that ensure religious freedom can have several positive impacts on a country's social harmony and economic growth. However, it's important to also consider potential challenges and the steps necessary for realizing these benefits sustainably:\n\n1. **Social Harmony:**\n   - **Increased Tolerance and Understanding:** Religious freedom allows individuals to express their beliefs openly without fear of persecution. This can lead to greater tolerance and understanding among different religious communities, fostering social cohesion.\n   - **Reduction of Religious Conflicts:** By guaranteeing religious freedom, a country can reduce the likelihood of religious conflicts and tensions, promoting peace and stability within society. However, managing cultural differences requires ongoing dialogue and education to prevent deeply rooted prejudices from hindering social harmony.\n   - **Cultural Diversity and Enrichment:** The coexistence of diverse religious groups can enrich the cultural landscape of a nation, encouraging exchanges of ideas, traditions, and values that can enhance mutual respect and appreciation. Community engagement initiatives and educational programs can support this enrichment and ensure equitable treatment across all religious groups.\n\n2. **Economic Growth:**\n   - **Attracting Talent and Investment:** Religious freedom can make a country more attractive to international talent and investors who seek a stable and open environment to live and conduct business. This can lead to increased foreign direct investment and enhance the country's global economic standing. Governments and communities must actively promote inclusivity to maintain this attractiveness.\n   - **Boosting Tourism:** A reputation for religious inclusivity can boost tourism, as travelers often prefer destinations where diverse religious practices are respected. Religious festivals and sites can attract visitors, benefiting local economies. Policies ensuring safety and respect for all types of visitors are crucial for sustained tourism growth.\n   - **Encouraging Innovation and Entrepreneurship:** When individuals feel safe to express their beliefs and live according to their values, they are more likely to contribute positively to society. A diverse population can lead to a greater exchange of ideas, fostering innovation and creativity in business ventures and community projects. Long-term educational and community support systems are necessary to encourage continued innovation.\n\nTo provide a more comprehensive view, examining case studies of countries like Canada, which has successfully implemented religious freedom policies leading to vibrant multiculturalism and economic development, can offer valuable insights into strategies for sustaining these positive impacts.\n\nOverall, while laws promoting religious freedom can contribute to building a harmonious society and driving economic growth, acknowledging challenges and implementing supportive measures are essential for achieving and maintaining these benefits over time.",
    "AlpagasusScore":4.0
}
```

## Generate from User Input

In your working directory, you'll find:
```shell
run_dataflow/playground/text_sft_synthesis_from_seed.py  
```

Set the seed data path in `first_entry_file_name`:
```python
self.storage = FileStorage(
        first_entry_file_name="./example_data/GeneralTextPipeline/pt_input.jsonl",
        cache_path="./cache",
        file_name_prefix="dataflow_cache_step",
        cache_type="jsonl",
    )
```

Users can customize synthesis requirements in `custom_prompt`:
```python
self.generator = SFTGeneratorSeed(llm_serving=llm_serving, custom_prompt="Try to make the question suitable for middle school students.")
```

### One-click Execution
```bash
python playground/text_sft_synthesis_from_seed.py  
```
The pipeline will invoke the [`SFTGeneratorSeed`](/en/guide/text_generate_operators/) operator to perform SFT data synthesis. This operator takes seed documents as input, extracts relevant information, and calls a large language model API to generate SFT-format data. It also supports the `custom_prompt` parameter to incorporate user-defined instructions.


### Example of Generated Data
The `raw_comtent` field is the original seed data.
```json
{
    "instruction":"How did Diccon Bewes and his mother compare their experiences while following Jemima Morrell's journey on the first Thomas Cook tour to Switzerland in 1863? Discuss the differences in travel methods and accommodations between the two trips.",
    "output":"Diccon Bewes and his mother compared their experiences by reading sections from Jemima Morrell's diary at each point in their journey. They noted differences such as travel methods—where Jemima traveled by rail, diligence, foot, mule, and steamship, Bewes used modern trains where possible—and accommodations, recognizing that many lodgings Jemima stayed at no longer existed or offered modern conveniences. They highlighted how travel time has been reduced and how the tourism industry, along with the physical environment, has changed drastically over the years.",
    "raw_content":"Slow Train to Switzerland\nFinished September 28\nSlow Train to Switzerland: One Tour, Two Trips, 150 Years -- and a World of Change Apart by Diccon Bewes\nI liked the premise of this book, following in the footsteps of an earlier journey. Diccon Bewes is a British travel writer who lives in Switzerland, and during research he came across a diary from a young Englishwoman, Jemima Morrell, who, as part of a group who called themselves the Junior United Alpine Club, travelled on the very first Thomas Cook tour to Switzerland in 1863. The group consisted of four young women and three young men, and included Jemima's brother William, who paid for both of them.\nBewes determined to follow as much as possible in her footsteps, following the route she took, staying in the same places and visiting the same sights as much as possible. Near the beginning of the book is a map of the Cook tour from 1863 which took place from June 26th to July 15th, and included travel by rail, diligence, foot, mule, and steamship. With Thomas Cook the company that launched modern mass tourism, and by the time I finished the book going into bankruptcy, this book looks at travel from an interesting vantage point. Bewes took the trip with his mother, going back to certain points at a later date on his own.\nAppendices include: a brief description of the world in 1863, and a timeline of that year showing some important events that occured; a summary, including data points of Switzerland in the 1860s with information on language spoken, size of towns, birth and death rates, wages and prices, and occupations; and descriptions and explanations on money of the time, both English and Swiss their modern equivalencies.\nAs he followed Jemima's journey, he and his mother read sections from the diary at each point in their journey, and while many of the lodgings that she stayed in no longer existed, a few did. Some sections of the journey are now done by train, where there weren't trains back then, and Jemima's journey definitely involved longer and more difficult travel times. Some of her days were exceedingly long, and many of the places she stayed didn't offer the modern conveniences now available.\nDewes shows the differences between the two experiences plainly, from the modes of travel, to the the time travelling took, to the things one was able to see at each point in the journey. He shows the huge changes that have taken place in the tourism industry in Switzerland, and talks about the drivers of those changes. He discusses changes to the physical environment, from the buildings and food on offer to the shrinking of the snow caps and glaciers. He follows up at the end with a look at what became of Jemima after this journey and the discovery of a personal connection to her family.\nThis was a fascinating and educational read, and hugely entertaining.\nLabels: History, Journeys, Memoirs, Switzerland, Travel, Writers\nNutcracker Night\nTears of Salt\nTriceratops Stomp\nThe Castle in the Sea\nThe Corner That Held Them\nMy Drowning\nA Better Man\nMurder in Passy\nBody Bereft\nMrs. Saint and the Defectives\n13th Canadian Book Challenge October Roundup"
}
```
