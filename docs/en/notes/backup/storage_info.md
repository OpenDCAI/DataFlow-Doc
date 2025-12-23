---
title: Storage Module
createTime: 2025/06/12 12:00:01
permalink: /en/dev_guide/storage_info/
---

# Storage Module

Dataflow’s storage system is built around the DataFlowStorage abstract base class, fully decoupling the storage layer from algorithm, data-flow control and other logic. Users only need to subclass DataFlowStorage and implement the read and write interfaces to seamlessly integrate custom file systems, object storage services or databases as backends—without modifying existing operators or pipeline code.

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

We provide a built-in default implementation in the DataFlow system called FileStorage, which supports reading and writing common formats on the local file system (JSON/JSONL, CSV, Parquet, Pickle), helping users get started quickly and covering the majority of scenarios.
<!--
# Storage Module

DataFlow implements interfaces for vector databases. Below is an introduction using MyScaleStorage as an example.

The structure of a DataFlow data table is as follows:

| Field Name           | Type               | Description                                                                 |
|----------------------|--------------------|-----------------------------------------------------------------------------|
| id                   | uuid               | Primary Key                                                                 |
| data                 | TEXT/JSON          | The actual data                                                             |
| pipeline_id          | uuid               |                                                                             |
| stage                | int                | Order of the operator in the pipeline                                       |
| eval_stage           | int                | Number of times the data has been evaluated                                 |
| raw_data_id          | int                | Foreign Key, ID of the raw data                                             |
| task_id              | TEXT               | Task ID                                                                     |
| category             | categorical        | Data type (math/code/scientific/etc.), recommended in multi-label format   |
| description          | TEXT               | Description of the data (e.g., data from company X)                         |
| format               | categorical        | Data format (PT, SFT_Single, SFT_Multi, RLHF, etc.)                         |
| Operator_Type        | categorical        | Type of operator (Text/Math-specific or general)                            |
| Synthetic            | categorical        | Whether the data is synthetic (fully synthetic/synthetic answer/question/none) |
| eval_score_{\$i}      | float / BOOL / int | Content added by algorithm $i                                               |
| eval_algorithm_{\$i}  | TEXT               | Description of algorithm $i                                                 |
| eval_info_{\$i}       | TEXT               | Error information                                                           |

### Quick Start for Using Database Interfaces

Reading data:
- For String type: `read_str`
- For JSON type: `read_json`

Writing data:
- Adding new synthetic data (e.g., rewritten questions):
  * For String type: `write_str`
  * For JSON type: `write_json`

- Adding labels (scores/categories/other metadata tied to original data):
  * If the label is countable (e.g., score, finite category): use `write_eval`, which writes to the `eval_score` column.
    + To add additional info (e.g., scoring rationale), also use this method to write to the `eval_info` column.
  * If the label is uncountable (e.g., an answer generated from the original question): use `write_data`, which modifies the `data` column and allows modification of other fields via parameters.

### Interface and Parameter Descriptions

### Read Interfaces

- `read_str(self, key_list: list[str], **kwargs)`: Use when `data` is of string type. `key_list` is a list of fields to read. Required `kwargs`:
  * `category`: Data type (e.g., "reasoning", "text", "code")
  * `pipeline_id`: Current pipeline ID (from config)
  * `stage`: Current operator stage (from config)
  * `eval_stage`: Number of eval columns to read (from config)
    + `maxmin_scores`: If `eval_stage` > 0, provide score filters as `read_min_score` and `read_max_score` in `list[float]` format. Example:
    ``maxmin_scores = [dict(zip(['min_score', 'max_score'], list(_))) for _ in zip(self.read_min_score, self.read_max_score)]
    ``
  * !`format`: Data format, as in the table
  * !`!syn`: Synthetic data format - choose from "", "syn", "syn_q", "syn_a", "syn_qa"


Returns data as a `list[dict]` with default `id` as the primary key.

- `read_json(self, key_list: list[str], **kwargs)`: Use when `data` is JSON. Same as `read_str`, but returns `data` as a `dict`.

### Write Interfaces

- `write_str(self, data: list[dict], **kwargs)`: The `data` parameter contains the data to be written. In the dictionary, the key `id` corresponds to the ID of the original data, and the data under the `data` key must be of type `str`. The required parameters in `**kwargs` are as follows:
    * `category`: The type of data, such as "reasoning", "text", "code"
    * `format`: Data format, refer to the table structure
    * `syn`: Whether the data is synthetic. Choose from "" (not synthetic), "syn" (synthetic), "syn_q" (synthetic question), "syn_a" (synthetic answer), "syn_qa" (synthetic QA pair)
    * `pipeline_id`: The ID of the current pipeline, must be provided in the config file
    * `stage`: The position of the current operator in the pipeline + 1, must be provided in the config file

This method will add new rows to the database. The eval columns for the new data will be cleared.

- `write_json(self, data: list[dict], **kwargs)`: The `data` parameter contains the data to be written. In the dictionary, the key `id` corresponds to the ID of the original data, and the data under the `data` key must be of type `dict`. The required parameters in `**kwargs` are as follows:
    * `category`: The type of data, such as "reasoning", "text", "code"
    * `format`: Data format, refer to the table structure
    * `syn`: Whether the data is synthetic. Choose from "" (not synthetic), "syn" (synthetic), "syn_q" (synthetic question), "syn_a" (synthetic answer), "syn_qa" (synthetic QA pair)
    * `pipeline_id`: The ID of the current pipeline, must be provided in the config file
    * `stage`: The position of the current operator in the pipeline + 1, must be provided in the config file

This method will add new rows to the database. The eval columns for the new data will be cleared.

- `write_eval(self, data: list[dict], **kwargs)`: The `data` parameter includes the original data ID and the new score (of type float) and information (of type str). The required parameters in `**kwargs` are as follows:
    * `stage`: The position of the current operator in the pipeline + 1, must be provided in the config file    
    * `score_key`: The key corresponding to the score in the data parameter. If the data field is in the form `[{'id': xxx, 'score1': xxx}]`, this should be `'score1'`
    * `algo_name`: Name of the operator, can default to `self.__class__.__name__`
    * `info_key`: Extra information to be stored. If the data field is in the form `[{'id': xxx, 'score1': xxx, 'info1': xxx}]`, this should be `'info1'`

This method modifies the eval columns of the existing row in the database.

- `write_data(self, data: list[dict], **kwargs)`: The `data` parameter includes the original data ID and the new content for the `data` field. The required parameters in `**kwargs` are as follows:
    * `stage`: The position of the current operator in the pipeline + 1, must be provided in the config file
    * `__some_keys__`: If other non-eval fields in the data need to be modified, they can be passed in as additional keyword arguments
        + Note: The `syn` parameter here should be changed to `Synthetic`, otherwise an error will be raised.

This method modifies the `data` column of the existing row in the database.
-->