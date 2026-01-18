---
title: QuratingFilter
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/text_pt/filter/quratingfilter/
---

## 📘 概述

`QuratingFilter` 是一个数据过滤算子，它基于 `QuratingScorer` 打分器的得分对数据进行筛选。该算子通过 Qurating 模型从四个维度评估文本质量：写作风格、所需专业知识、事实与 trivia 内容、教育价值。每个维度评分范围为 0-9 分，可用于筛选高质量的教育类或知识类内容。

## \_\_init\_\_函数

```python
def __init__(self, min_scores: dict = {'writing_style': 0,'required_expertise': 0,'facts_and_trivia': 0,'educational_value': 0}, max_scores: dict = {'writing_style': 9,'required_expertise': 9,'facts_and_trivia': 9,'educational_value': 9}, map_batch_size: int = 512, num_workers: int = 1, device_batch_size: int = 16, device: str = 'cuda', labels: list = ['writing_style', 'required_expertise', 'facts_and_trivia', 'educational_value'], model_cache_dir: str = './dataflow_cache')
```

### init参数说明

| 参数名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **min\_scores** | dict | `{'writing_style': 0, ...}` | 各维度保留样本的最小分数阈值。 |
| **max\_scores** | dict | `{'writing_style': 9, ...}` | 各维度保留样本的最大分数阈值。 |
| **map\_batch\_size** | int | 512 | 映射批次大小。 |
| **num\_workers** | int | 1 | 数据加载工作进程数。 |
| **device\_batch\_size** | int | 16 | 设备批次大小。 |
| **device** | str | "cuda" | 模型运行设备。 |
| **labels** | list | `['writing_style', ...]` | 需要评估的维度列表。 |
| **model\_cache\_dir** | str | "./dataflow\_cache" | 模型缓存目录。 |

### Prompt模板说明

| Prompt 模板名称 | 主要用途 | 适用场景 | 特点说明 |
| :--- | :--- | :--- | :--- |
| | | | |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str)
```

#### 参数

| 名称 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | 必需 | 数据流存储实例，负责读取与写入数据。 |
| **input\_key** | str | 必需 | 输入列名，对应需要评估质量的文本字段。 |

## 🧠 示例用法

```python
from dataflow.operators.text_pt.filter import QuratingFilter
from dataflow.utils.storage import FileStorage

# 准备数据和存储
storage = FileStorage(first_entry_file_name="pt_input.jsonl")

# 初始化并运行算子
qurating_filter = QuratingFilter()
qurating_filter.run(
    storage.step(),
    input_key='raw_content'
)
```

#### 🧾 默认输出格式（Output Format）

该算子会过滤输入数据，并将满足所有分数阈值条件的行写回存储。同时，会在输出的 DataFrame 中为每个评估维度添加一个标签列（例如 `writing_style_label`），其值为 1 表示通过该维度筛选，0 表示未通过。

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| ... | ... | 原始输入数据中的所有字段。 |
| **{label}\_label** | int | 对应维度是否通过筛选的标签（1表示通过，0表示未通过）。 |

**示例输入:**
```json
{
"raw_content": "Ohmydollz Frogitaire Jurassic Pinball Kore Putt Sling Jumper 2\nFranckfort\nCalifornia To Enforce Stringent Auto Emission Regulations\nEarlier, the state of California issued proposed emissions regulations that are expected to be enforced in the next decade. The proposed regulations, when approved, could force automakers to reduce tailpipe emissions of greenhouse gases. The latter are intimately related to global warming. Parenthetically, the state is aiming to reduce 30 percent of harmful gas emissions by passing stringent auto regulations.\nCalifornia represents about 10 per cent of the overall American auto market. Auto analysts expect that if the proposed regulations are adopted later this year after the review process, it would be the very first limits in the United States regarding auto emissions of gasses linked to global warming. In addition, other states in the nation are expected to follow same regulations to further promote the wellbeing of its citizens and their environment. At least four Northeastern states are observing what California is currently doing.\nThe California Air Resources Board, the one responsible of the proposed regulations, said that the stringent emission regulation is made in response to a state law enacted in 2002. Said law requires automakers to produce cars, pickup trucks, sport utility vehicles and minivans that emit 30 per cent less greenhouse gases on average by 2015.\nThe proposed regulations are expected to increase the market value of new vehicles. However, the boards did not go into specifics by divulging the anticipated increase. With the proposed regulations, automotive emission parts are expected to become expensive due to the upgrades and innovations to come up with reduced greenhouse gases emissions. On the one hand, automakers are trying to prevent the proposal from becoming a law. California's actions have tremendous repercussions for the auto industry because the state represents about 10 per cent of the nation's car market.\nThe proposal entails added expenditures to automakers because of the required studies, testing, materials and modifications. Consequently, there is no assurance of a greener pasture attributed to the enhancements of emission control parts.\nThe upgrades needed to meet California's proposed regulations could add thousands of dollars to the price of a new vehicle, said Eron Shosteck of the Alliance of Automobile Manufacturers. \"We are happy to offer these efficient fuel-saving technologies. But consumers just don't want to buy them... Automakers believe consumers should have the option to choose.\" He added that the regulations would result in vehicles that are \"lighter, smaller, less powerful, and less able to do what consumers want.\"\nCalifornia has the dirtiest air in America. This is the very reason why several movements have been established to take care of the matter. In addition to these cause-oriented movements, the state's Air Resources Board is also determined to promote a cleaner air to preclude illness and other hazardous effects of global warming.\nGlobal warming, the continuous increase of Earth's temperature, is said to be mostly attributable to human activities that results to increased atmospheric concentration of greenhouse gases like carbon dioxide, a colorless gas that rises into the atmosphere and traps heat. The situation further leads to warming of the atmosphere by escalating the greenhouse effect.\nGlobal warming influences both the natural environment and human life. Its effects include sea level rise, agricultural repercussions, thinning of the ozone layer, extreme weather events and spread of disease like malaria and other infectious maladies.\nCalifornia officials said automakers could reduce carbon dioxide emissions by improving gas mileage. Less fuel consumption would result in fewer emissions. They further noted that gas mileage could be improved with available technology, such as high-tech transmissions that shift automatically into the most efficient gear.\nAbout the Author: Joe Thompson is the owner of a successful auto body shop in Ferndale, California. This 38 year old is also a prolific writer, contributing automotive related articles to various publications."
}
```
**示例输出:**
```json
{
"raw_content": "Ohmydollz Frogitaire Jurassic Pinball Kore Putt Sling Jumper 2\nFranckfort\nCalifornia To Enforce Stringent Auto Emission Regulations\nEarlier, the state of California issued proposed emissions regulations that are expected to be enforced in the next decade. The proposed regulations, when approved, could force automakers to reduce tailpipe emissions of greenhouse gases. The latter are intimately related to global warming. Parenthetically, the state is aiming to reduce 30 percent of harmful gas emissions by passing stringent auto regulations.\nCalifornia represents about 10 per cent of the overall American auto market. Auto analysts expect that if the proposed regulations are adopted later this year after the review process, it would be the very first limits in the United States regarding auto emissions of gasses linked to global warming. In addition, other states in the nation are expected to follow same regulations to further promote the wellbeing of its citizens and their environment. At least four Northeastern states are observing what California is currently doing.\nThe California Air Resources Board, the one responsible of the proposed regulations, said that the stringent emission regulation is made in response to a state law enacted in 2002. Said law requires automakers to produce cars, pickup trucks, sport utility vehicles and minivans that emit 30 per cent less greenhouse gases on average by 2015.\nThe proposed regulations are expected to increase the market value of new vehicles. However, the boards did not go into specifics by divulging the anticipated increase. With the proposed regulations, automotive emission parts are expected to become expensive due to the upgrades and innovations to come up with reduced greenhouse gases emissions. On the one hand, automakers are trying to prevent the proposal from becoming a law. California's actions have tremendous repercussions for the auto industry because the state represents about 10 per cent of the nation's car market.\nThe proposal entails added expenditures to automakers because of the required studies, testing, materials and modifications. Consequently, there is no assurance of a greener pasture attributed to the enhancements of emission control parts.\nThe upgrades needed to meet California's proposed regulations could add thousands of dollars to the price of a new vehicle, said Eron Shosteck of the Alliance of Automobile Manufacturers. \"We are happy to offer these efficient fuel-saving technologies. But consumers just don't want to buy them... Automakers believe consumers should have the option to choose.\" He added that the regulations would result in vehicles that are \"lighter, smaller, less powerful, and less able to do what consumers want.\"\nCalifornia has the dirtiest air in America. This is the very reason why several movements have been established to take care of the matter. In addition to these cause-oriented movements, the state's Air Resources Board is also determined to promote a cleaner air to preclude illness and other hazardous effects of global warming.\nGlobal warming, the continuous increase of Earth's temperature, is said to be mostly attributable to human activities that results to increased atmospheric concentration of greenhouse gases like carbon dioxide, a colorless gas that rises into the atmosphere and traps heat. The situation further leads to warming of the atmosphere by escalating the greenhouse effect.\nGlobal warming influences both the natural environment and human life. Its effects include sea level rise, agricultural repercussions, thinning of the ozone layer, extreme weather events and spread of disease like malaria and other infectious maladies.\nCalifornia officials said automakers could reduce carbon dioxide emissions by improving gas mileage. Less fuel consumption would result in fewer emissions. They further noted that gas mileage could be improved with available technology, such as high-tech transmissions that shift automatically into the most efficient gear.\nAbout the Author: Joe Thompson is the owner of a successful auto body shop in Ferndale, California. This 38 year old is also a prolific writer, contributing automotive related articles to various publications.",
"writing_style_label": 1,
"required_expertise_label": 1,
"facts_and_trivia_label": 1,
"educational_value_label": 1
}
```
