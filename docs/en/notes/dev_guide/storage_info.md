---
title: Storage Module
createTime: 2025/06/12 12:00:01
permalink: /en/dev_guide/storage_info/
---

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

- `read_str(self, key_list: list[str], **kwargs)`: Use when `data` is of string type. `key_list` is a list of fields to read. Required `kwargs`:
  * `category`: Data type (e.g., "reasoning", "text", "code")
  * `format`: Data format, as in the table
  * `syn`: Synthetic data format - choose from "", "syn", "syn_q", "syn_a", "syn_qa"
  * `pipeline_id`: Current pipeline ID (from config)
  * `stage`: Current operator stage (from config)
  * `eval_stage`: Number of eval columns to read (from config)
    + `maxmin_scores`: If `eval_stage` > 0, provide score filters as `read_min_score` and `read_max_score` in `list[float]` format. Example:
    ```python
    maxmin_scores = [dict(zip(['min_score', 'max_score'], list(_))) for _ in zip(self.read_min_score, self.read_max_score)]
    ```

Returns data as a `list[dict]` with default `id` as the primary key.

- `read_json(self, key_list: list[str], **kwargs)`: Use when `data` is JSON. Same as `read_str`, but returns `data` as a `dict`.

- `read_str_by_stage(self, key_list: list[str], **kwargs)`: Use when `data` is string. No need to specify `format` and `syn`.

- `read_json_by_stage(self, key_list: list[str], **kwargs)`: Use when `data` is JSON. No need to specify `format` and `syn`.

Write interfaces:

- `write_str(self, data: list[dict], **kwargs)`: Data should be in `str` format. Required `kwargs`:
  * `category`, `format`, `syn`, `pipeline_id`, `stage` (+1)
Inserts new rows into the DB. Clears `eval` columns for new data.

- `write_json(self, data: list[dict], **kwargs)`: Data should be in `dict` format. Same `kwargs` as above. Also clears `eval` columns for new entries.

- `write_eval(self, data: list[dict], **kwargs)`: Used for writing eval scores and info. Required `kwargs`:
  * `stage`: operator stage +1
  * `score_key`: Key for score in `data` (e.g., 'score1')
  * `algo_name`: Operator name, typically `self.__class__.__name__`
  * `info_key`: Optional, for writing additional information (e.g., 'info1')

Modifies `eval` columns of existing data rows.

- `write_data(self, data: list[dict], **kwargs)`: Used to overwrite `data` field. Required `kwargs`:
  * `stage`: operator stage +1
  * Additional keys can be modified by passing extra `kwargs`
    + Note: `syn` should be changed to `Synthetic`, otherwise it will raise an error.

Modifies `data` field in the database.
