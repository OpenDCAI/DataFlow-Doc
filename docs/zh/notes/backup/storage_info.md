---
title: 存储模块
createTime: 2025/06/12 12:00:01
permalink: /zh/dev_guide/storage_info/
---

# Storage 模块

Dataflow 的存储系统以 DataFlowStorage 抽象基类为核心，将存储层与算法、数据流控制等逻辑完全解耦。用户只需继承 DataFlowStorage 并实现 read、write 接口，就能无缝接入自定义文件系统、对象存储或数据库等后端，无需改动现有算子和流程代码。

```python
class DataFlowStorage(ABC):
    """
    Abstract base class for data storage.
    """
    @abstractmethod
    def read(self, output_type) -> Any:
        """
        Read data from file.
        type: type that you want to read to, such as "datatrame", List[dict], etc.
        """
        pass
    
    @abstractmethod
    def write(self, data: Any) -> Any:
        pass
```

我们在DataFlow系统中内置了 FileStorage 默认实现，支持本地文件系统下常见的 JSON/JSONL、CSV、Parquet、Pickle 等格式读写，帮助用户快速上手并满足大多数场景需求。

<!-- DataFlow实现了向量数据库的相关接口，下面以MyScaleStorage为例进行介绍。

DataFlow数据表的结构如下
| 字段名              | 类型                | 描述                                                         |
|---------------------|---------------------|--------------------------------------------------------------|
| id                  | uuid                 | Primary Key                                                  |
| data                | TEXT/JSON                    | 数据本身                                                    |
| pipeline_id         | uuid   |                                                              |
| stage               | int                 | 算子的排序                                                  |
| eval_stage          | int                 | 算子目前经过 eval 的次数                                    |
| raw_data_id         | int                 | Foreign Key，原始数据 id                                    |
| task_id             | TEXT                | 就是任务的 id                                               |
| category            | categorical         | 数据类型（数学/代码/科学数据/...）建议多选格式              |
| description         | TEXT                | 数据的描述（比如 xx 公司的 xx 数据）                        |
| format              | categorical         | 数据格式（PT, SFT_Single, SFT_Multi, RLHF 其中一种数据类型）|
| Operator_Type       | categorical         | 算子类型（针对 Text/Math... 还是通用算子）                 |
| Synthetic           | categorical         | 是否是合成数据？（完全合成/合成 Answer/合成 Question/不是合成）|
| eval_score_{$i}     | float / BOOL / int  | 第 i 个算法添加的内容                                       |
| eval_algorithm_{$i} | TEXT                | 描述第 i 个算法是什么                                       |
| eval_info_{$i}      | TEXT                | 报错                                                         | -->
<!-- 
| 字段名              | 类型                | 描述                                                         |
|---------------------|---------------------|--------------------------------------------------------------|
| id                  | uuid                | Primary Key                                                  |
| data                | TEXT/JSON           | 数据本身                                                    |
| pipeline_id         | uuid                |                                                              |
| stage               | int                 | 算子的排序                                                  |
| eval_stage          | int                 | 算子目前经过 eval 的次数                                    |
| raw_data_id         | int                 | Foreign Key，原始数据 id                                    |
| task_id             | TEXT                | 就是任务的 id                                               |
| category            | categorical         | 数据类型（数学/代码/科学数据/...）建议多选格式              |
| description         | TEXT                | 数据的描述（比如 xx 公司的 xx 数据）                        |
| format              | categorical         | 数据格式（PT, SFT_Single, SFT_Multi, RLHF 其中一种数据类型）|
| Operator_Type       | categorical         | 算子类型（针对 Text/Math... 还是通用算子）                 |
| Synthetic           | categorical         | 是否是合成数据？（完全合成/合成 Answer/合成 Question/不是合成）|
| eval_score_{\$i}     | float / BOOL / int  | 第 i 个算法添加的内容                                       |
| eval_algorithm_{\$i} | TEXT                | 描述第 i 个算法是什么                                       |
| eval_info_{\$i}      | TEXT                | 报错                                                         |



### 数据库接口使用Quick Start

读取数据:
- 类型为String：``read_str``
- 类型为JSON：``read_json``

写入数据:
- 添加新的合成数据（如问题改写）:
    * 如果数据类型为String: ``write_str``
    * 数据类型为JSON: ``write_json``

- 添加标签（分数/类别/其它与原数据深度绑定的信息）:
    * 标签是可数的（如分数，有限类别）: ``write_eval`` 该接口将在数据的``eval_score``列写入标签。
        + 如果有额外的添加信息需求（如评分理由），仍然可以通过调用该接口写入``eval_info``列。
    * 标签是不可数的（如根据原问题数据生成的答案）: ``write_data`` 该接口直接修改数据的``data``列，并可通过参数对其它列进行修改。

### 接口及其参数介绍

读取数据的接口如下:
- ``read_str(self, key_list: list[str], **kwargs)``: data字段为string类型时使用，key_list为想要读取出的字段组成的列表，类型限制为``list[str]``，可变参数中必须含有以下几种参数：
    * ``category``: 数据的类型，如"reasoning", "text", "code"
    * ``pipeline_id``: 当前pipeline的id，要求在配置文件中传入。
    * ``stage``: 当前算子在pipeline中的位置，要求在配置文件中传入。
    * ``eval_stage``: 当前算子想要读出的数据中含有eval数据的列数，要求在配置文件中传入。
        + !``maxmin_scores``: 若``eval_stage``大于0，读入时可能需要对分数进行最大值和最小值的筛选，要求在配置文件中传入list[float]形式的read_min_score和read_max_score。传入时的格式可以参考``maxmin_scores=[dict(zip(['min_score', 'max_score'], list(_))) for _ in list(zip(self.read_min_score, self.read_max_score))]``
    * !``format``: 数据格式，参考表结构
    * !``syn``: 是否为合成数据，合成数据的具体格式，在""（非合成数据）, "syn"（合成数据）, "syn_q"（合成问题数据）, "syn_a"（合成答案数据）, "syn_qa"（合成QA对数据）中选择 


返回的数据为list[dict]类型,其中默认带有主键,存储在id关键字下。

- ``read_json(self, key_list: list[str], **kwargs)``: data字段为JSON类型时使用, 使用方法与``read_str()``相同，此处返回的数据中data字段下为dict类型的数据。

- ``read_str_by_stage(self, key_list: list[str], **kwargs)``: data字段为str类型时使用，可变参数中不需要有``format``和``syn``。

- ``read_json_by_stage(self, key_list: list[str], **kwargs)``: data字段为JSON类型时使用，可变参数中不需要有``format``和``syn``。

写入数据的接口如下：

- ``write_str(self, data: list[dict], **kwargs)``: data参数中是需要写入的数据,字典中id关键字对应的是原数据的id,data关键字下的数据要求为``str``类型。可变参数中需要的参数如下：
    * ``category``: 数据的类型，如"reasoning", "text", "code"
    * ``format``: 数据格式，参考表结构
    * ``syn``: 是否为合成数据，合成数据的具体格式，在""（非合成数据）, "syn"（合成数据）, "syn_q"（合成问题数据）, "syn_a"（合成答案数据）, "syn_qa"（合成QA对数据）中选择 
    * ``pipeline_id``: 当前pipeline的id，要求在配置文件中传入。
    * ``stage``: 当前算子在pipeline中的位置+1，要求在配置文件中传入。
使用该方法将在数据库中加入新的行，新数据eval列数据清空。

- ``write_json(self, data: list[dict], **kwargs)``: data参数中是需要写入的数据,字典中id关键字对应的是原数据的id,data关键字下的数据要求为``dict``类型。可变参数中需要的参数如下：
    * ``category``: 数据的类型，如"reasoning", "text", "code"
    * ``format``: 数据格式，参考表结构
    * ``syn``: 是否为合成数据，合成数据的具体格式，在""（非合成数据）, "syn"（合成数据）, "syn_q"（合成问题数据）, "syn_a"（合成答案数据）, "syn_qa"（合成QA对数据）中选择 
    * ``pipeline_id``: 当前pipeline的id，要求在配置文件中传入。
    * ``stage``: 当前算子在pipeline中的位置+1，要求在配置文件中传入。
使用该方法将在数据库中加入新的行，新数据eval列数据清空。

- ``write_eval(self, data: list[dict], **kwargs)``: data参数中是原数据的id和新数据的分数(float类型)和信息(str类型)。要求的可变参数如下：
    * ``stage``: 当前算子在pipeline中的位置+1，要求在配置文件中传入。    
    * ``score_key``: data参数中分数对应的关键字，若data字段的形式为``[{'id': xxx, 'score1': xxx}]``，则此处应传入'score1'。
    * ``algo_name``: 算子名称，可以默认使用``self.__class__.__name__``
    * !``info_key``: data参数中需要额外存储的信息，若data字段的形式为``[{'id': xxx, 'score1': xxx, 'info1': xxx}]``，则此处应传入'info1'。
使用该方法将对数据库中原数据所在的行的eval列进行修改。

- ``write_data(self, data: list[dict], **kwargs)``: data参数中是原数据的id和新的data字段的数据。要求的可变参数如下：
    * ``stage``: 当前算子在pipeline中的位置+1，要求在配置文件中传入。
    * !``__some_keys__``: 如果data其他非eval字段需要修改，可以传入可变参数中。
        + 注意：此处的syn参数要改成Syntheic，否则会报错。

使用该方法将对数据库中原数据所在的行的data列进行修改。 
-->
