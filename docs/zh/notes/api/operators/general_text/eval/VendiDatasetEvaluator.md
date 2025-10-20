---
title: VendiDatasetEvaluator
createTime: 2025/10/09 17:09:04
permalink: /zh/api/operators/general_text/eval/vendidatasetevaluator/
---

## 📘 概述

`VendiDatasetEvaluator` 是一个用于评估数据集多样性的算子。它通过计算 VendiScore 来实现这一功能，利用预训练的 BERT 和 SimCSE 模型生成文本嵌入，并基于这些嵌入计算最终的多样性分数。

**主要功能**：
- 使用 BERT 和 SimCSE 模型生成文本嵌入向量
- 计算基于嵌入向量的 Vendi 多样性得分
- 返回数据集级别的多样性评估结果
- 支持 GPU 加速计算

**适用场景**：评估整个数据集的语义多样性，而非单个样本

## __init__函数

```python
def __init__(self, device='cuda')
```

### init参数说明

| 参数名      | 类型 | 默认值   | 说明         |
| :---------- | :--- | :------- | :----------- |
| **device**  | str  | `'cuda'` | 计算设备。 |

## run函数

```python
def run(self, storage: DataFlowStorage, input_key: str, use_simcse: bool = True)
```

#### 参数

| 名称            | 类型              | 默认值 | 说明                           |
| :-------------- | :---------------- | :----- | :----------------------------- |
| **storage**     | DataFlowStorage   | 必需   | 数据流存储实例，负责读取与写入数据。 |
| **input\_key**  | str               | 必需   | 输入列名，对应需要评估的文本字段。   |
| **use\_simcse** | bool              | True   | 是否使用 SimCSE 模型计算得分。   |

## 🧠 示例用法

```python
from dataflow.operators.general_text import VendiDatasetEvaluator
from dataflow.utils.storage import FileStorage

class VendiDatasetEvaluatorTest():
    def __init__(self):
        self.storage = FileStorage(
            first_entry_file_name="./dataflow/example/GeneralTextPipeline/vendi_test_input.jsonl",
            cache_path="./cache",
            file_name_prefix="dataflow_cache_step",
            cache_type="jsonl",
        )
        
        self.evaluator = VendiDatasetEvaluator(
            device='cuda'
        )
        
    def forward(self):
        result = self.evaluator.run(
            storage=self.storage.step(),
            input_key='text'
        )
        return result

if __name__ == "__main__":
    test = VendiDatasetEvaluatorTest()
    result = test.forward()
    print(f"Vendi Result: {result}")
```

#### 🧾 默认输出格式（Output Format）

| 字段                | 类型  | 说明             |
| :------------------ | :---- | :--------------- |
| BERTVendiScore      | float | 基于BERT的多样性得分。 |
| SimCSEVendiScore    | float | 基于SimCSE的多样性得分。 |

#### 📋 示例输入

```json
{"text": "The stock market showed significant gains today as investors responded positively to the Federal Reserve's latest policy announcement."}
{"text": "Scientists discovered a new species of deep-sea fish in the Mariana Trench during a recent expedition."}
{"text": "The championship game ended in a thrilling overtime victory for the home team."}
{"text": "A new study reveals that regular exercise can significantly improve cognitive function in older adults."}
{"text": "The tech company announced plans to launch its innovative smartphone model next quarter."}
{"text": "Climate change activists organized a massive protest in the capital city demanding immediate action."}
{"text": "The award-winning chef opened a new restaurant featuring fusion cuisine from around the world."}
{"text": "Researchers developed a breakthrough treatment that shows promise for treating rare genetic disorders."}
{"text": "The museum unveiled a rare collection of ancient artifacts discovered in Egypt."}
{"text": "Economic analysts predict steady growth in the renewable energy sector over the next decade."}
```

#### 📤 示例输出

```json
{
  "BERTVendiScore": 1.25,
  "SimCSEVendiScore": 8.72
}
```

#### 📊 结果分析

**输入数据集包含10条不同主题的文本**：金融市场、海洋生物学、体育、医学研究、科技产品、气候变化、美食、遗传学、考古学、能源经济等。

**输出结果解释**：
- **BERTVendiScore: 1.25** - 基于 BERT 嵌入计算的多样性得分。BERT 作为通用语言模型，其嵌入空间较为平滑，得分相对较低。
- **SimCSEVendiScore: 8.72** - 基于 SimCSE 嵌入计算的多样性得分。SimCSE 是专门为句子语义相似度优化的模型，能更好地区分不同主题的文本，因此得分较高，更能反映数据集的实际多样性。

**得分解释**：VendiScore 的理论范围是 1 到样本数量（本例中为10）。得分越接近样本数量，表示数据集越多样化；得分越接近1，表示数据集越同质化。SimCSEVendiScore 为 8.72 说明这10条文本具有很高的语义多样性，覆盖了多个不同的主题领域。

**应用价值**：该算子可用于评估训练数据集的语义覆盖范围和多样性，帮助判断数据集是否包含足够丰富的语义信息，从而训练出泛化能力更强的模型。相比 Task2Vec，VendiScore 更侧重于直接的语义嵌入多样性评估。
