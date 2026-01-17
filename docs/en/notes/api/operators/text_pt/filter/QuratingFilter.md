---
title: QuratingFilter
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/text_pt/filter/quratingfilter/
---

## 📘 Overview
The `QuratingFilter` operator filters data based on scores from the `QuratingScorer`. It evaluates text quality across four dimensions using the Qurating model: writing style, required expertise, facts and trivia content, and educational value. Each dimension is scored from 0-9, providing a comprehensive quality assessment suitable for filtering high-quality educational or knowledge-based content.

## `__init__`
```python
def __init__(self, min_scores: dict = {'writing_style': 0,'required_expertise': 0,'facts_and_trivia': 0,'educational_value': 0}, max_scores: dict = {'writing_style': 9,'required_expertise': 9,'facts_and_trivia': 9,'educational_value': 9}, map_batch_size: int = 512, num_workers: int = 1, device_batch_size: int = 16, device: str = 'cuda', labels: list = ['writing_style', 'required_expertise', 'facts_and_trivia', 'educational_value'], model_cache_dir: str = './dataflow_cache')
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **min_scores** | dict | `{'writing_style': 0, ...}` | Minimum score thresholds for each dimension to keep a sample. |
| **max_scores** | dict | `{'writing_style': 9, ...}` | Maximum score thresholds for each dimension to keep a sample. |
| **map_batch_size** | int | 512 | Mapping batch size for processing. |
| **num_workers** | int | 1 | Number of data loading workers. |
| **device_batch_size** | int | 16 | Batch size for each device. |
| **device** | str | 'cuda' | The device to run the model on (e.g., 'cuda', 'cpu'). |
| **labels** | list | `['writing_style', ...]` | List of evaluation dimensions to score. |
| **model_cache_dir** | str | './dataflow_cache' | Directory to cache the downloaded model. |

## `run`
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | DataFlow storage instance, responsible for reading and writing data. |
| **input_key** | str | Required | The column name in the dataframe that contains the text to be evaluated. |

## Prompt Template Descriptions

## 🧠 Example Usage
```python
from dataflow.operators.text_pt.filter import QuratingFilter
from dataflow.utils.storage import FileStorage

# Prepare data and storage
storage = FileStorage(first_entry_file_name="pt_input.jsonl")

# Initialize and run the operator
qurating_filter = QuratingFilter()
qurating_filter.run(
    storage.step(),
    input_key='raw_content'
)
```

#### 🧾 Default Output Format (Output Format)
| Field | Type | Description |
| :--- | :--- | :--- |
| ... | - | The operator preserves all original fields from the input data. |
| {label}_label | int | A binary flag (1 or 0) indicating if the sample's score for that dimension is within the specified range. |

**Example Input:**
```json
{
"raw_content": "Ohmydollz Frogitaire Jurassic Pinball Kore Putt Sling Jumper 2\nFranckfort\nCalifornia To Enforce Stringent Auto Emission Regulations\nEarlier, the state of California issued proposed emissions regulations that are expected to be enforced in the next decade. The proposed regulations, when approved, could force automakers to reduce tailpipe emissions of greenhouse gases. The latter are intimately related to global warming. Parenthetically, the state is aiming to reduce 30 percent of harmful gas emissions by passing stringent auto regulations.\nCalifornia represents about 10 per cent of the overall American auto market. Auto analysts expect that if the proposed regulations are adopted later this year after the review process, it would be the very first limits in the United States regarding auto emissions of gasses linked to global warming. In addition, other states in the nation are expected to follow same regulations to further promote the wellbeing of its citizens and their environment. At least four Northeastern states are observing what California is currently doing.\nThe California Air Resources Board, the one responsible of the proposed regulations, said that the stringent emission regulation is made in response to a state law enacted in 2002. Said law requires automakers to produce cars, pickup trucks, sport utility vehicles and minivans that emit 30 per cent less greenhouse gases on average by 2015.\nThe proposed regulations are expected to increase the market value of new vehicles. However, the boards did not go into specifics by divulging the anticipated increase. With the proposed regulations, automotive emission parts are expected to become expensive due to the upgrades and innovations to come up with reduced greenhouse gases emissions. On the one hand, automakers are trying to prevent the proposal from becoming a law. California's actions have tremendous repercussions for the auto industry because the state represents about 10 per cent of the nation's car market.\nThe proposal entails added expenditures to automakers because of the required studies, testing, materials and modifications. Consequently, there is no assurance of a greener pasture attributed to the enhancements of emission control parts.\nThe upgrades needed to meet California's proposed regulations could add thousands of dollars to the price of a new vehicle, said Eron Shosteck of the Alliance of Automobile Manufacturers. \"We are happy to offer these efficient fuel-saving technologies. But consumers just don't want to buy them... Automakers believe consumers should have the option to choose.\" He added that the regulations would result in vehicles that are \"lighter, smaller, less powerful, and less able to do what consumers want.\"\nCalifornia has the dirtiest air in America. This is the very reason why several movements have been established to take care of the matter. In addition to these cause-oriented movements, the state's Air Resources Board is also determined to promote a cleaner air to preclude illness and other hazardous effects of global warming.\nGlobal warming, the continuous increase of Earth's temperature, is said to be mostly attributable to human activities that results to increased atmospheric concentration of greenhouse gases like carbon dioxide, a colorless gas that rises into the atmosphere and traps heat. The situation further leads to warming of the atmosphere by escalating the greenhouse effect.\nGlobal warming influences both the natural environment and human life. Its effects include sea level rise, agricultural repercussions, thinning of the ozone layer, extreme weather events and spread of disease like malaria and other infectious maladies.\nCalifornia officials said automakers could reduce carbon dioxide emissions by improving gas mileage. Less fuel consumption would result in fewer emissions. They further noted that gas mileage could be improved with available technology, such as high-tech transmissions that shift automatically into the most efficient gear.\nAbout the Author: Joe Thompson is the owner of a successful auto body shop in Ferndale, California. This 38 year old is also a prolific writer, contributing automotive related articles to various publications."
}
```
**Example Output (for a record that passed the filter):**
```json
{
"raw_content": "Ohmydollz Frogitaire Jurassic Pinball Kore Putt Sling Jumper 2\nFranckfort\nCalifornia To Enforce Stringent Auto Emission Regulations\nEarlier, the state of California issued proposed emissions regulations that are expected to be enforced in the next decade. The proposed regulations, when approved, could force automakers to reduce tailpipe emissions of greenhouse gases. The latter are intimately related to global warming. Parenthetically, the state is aiming to reduce 30 percent of harmful gas emissions by passing stringent auto regulations.\nCalifornia represents about 10 per cent of the overall American auto market. Auto analysts expect that if the proposed regulations are adopted later this year after the review process, it would be the very first limits in the United States regarding auto emissions of gasses linked to global warming. In addition, other states in the nation are expected to follow same regulations to further promote the wellbeing of its citizens and their environment. At least four Northeastern states are observing what California is currently doing.\nThe California Air Resources Board, the one responsible of the proposed regulations, said that the stringent emission regulation is made in response to a state law enacted in 2002. Said law requires automakers to produce cars, pickup trucks, sport utility vehicles and minivans that emit 30 per cent less greenhouse gases on average by 2015.\nThe proposed regulations are expected to increase the market value of new vehicles. However, the boards did not go into specifics by divulging the anticipated increase. With the proposed regulations, automotive emission parts are expected to become expensive due to the upgrades and innovations to come up with reduced greenhouse gases emissions. On the one hand, automakers are trying to prevent the proposal from becoming a law. California's actions have tremendous repercussions for the auto industry because the state represents about 10 per cent of the nation's car market.\nThe proposal entails added expenditures to automakers because of the required studies, testing, materials and modifications. Consequently, there is no assurance of a greener pasture attributed to the enhancements of emission control parts.\nThe upgrades needed to meet California's proposed regulations could add thousands of dollars to the price of a new vehicle, said Eron Shosteck of the Alliance of Automobile Manufacturers. \"We are happy to offer these efficient fuel-saving technologies. But consumers just don't want to buy them... Automakers believe consumers should have the option to choose.\" He added that the regulations would result in vehicles that are \"lighter, smaller, less powerful, and less able to do what consumers want.\"\nCalifornia has the dirtiest air in America. This is the very reason why several movements have been established to take care of the matter. In addition to these cause-oriented movements, the state's Air Resources Board is also determined to promote a cleaner air to preclude illness and other hazardous effects of global warming.\nGlobal warming, the continuous increase of Earth's temperature, is said to be mostly attributable to human activities that results to increased atmospheric concentration of greenhouse gases like carbon dioxide, a colorless gas that rises into the atmosphere and traps heat. The situation further leads to warming of the atmosphere by escalating the greenhouse effect.\nGlobal warming influences both the natural environment and human life. Its effects include sea level rise, agricultural repercussions, thinning of the ozone layer, extreme weather events and spread of disease like malaria and other infectious maladies.\nCalifornia officials said automakers could reduce carbon dioxide emissions by improving gas mileage. Less fuel consumption would result in fewer emissions. They further noted that gas mileage could be improved with available technology, such as high-tech transmissions that shift automatically into the most efficient gear.\nAbout the Author: Joe Thompson is the owner of a successful auto body shop in Ferndale, California. This 38 year old is also a prolific writer, contributing automotive related articles to various publications.",
"writing_style_label": 1,
"required_expertise_label": 1,
"facts_and_trivia_label": 1,
"educational_value_label": 1
}
```
