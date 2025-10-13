---
title: NERRefiner
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/general_text/refine/nerrefiner/
---

## 📘 Overview
`NERRefiner` masks specific entities in text using Named Entity Recognition (NER) technology. It uses spaCy's 'en_core_web_sm' model to identify entities and replace them with corresponding entity type tags. This operator is useful for data anonymization or standardizing text by abstracting named entities.

## \_\_init\_\_
```python
def __init__(self):
```
This operator does not require any parameters during initialization.

## run
```python
def run(self, storage: DataFlowStorage, input_key: str)
```
Executes the main logic of the operator, reading the input DataFrame from storage, processing the text in the specified column to mask named entities, and writing the modified DataFrame back to storage.

#### Parameters
| Name          | Type              | Default Value | Description                                                              |
| :------------ | :---------------- | :------------ | :----------------------------------------------------------------------- |
| **storage**   | `DataFlowStorage` | Required      | Data flow storage instance, responsible for reading and writing data.    |
| **input_key** | `str`             | Required      | The column name of the text to be processed in the input DataFrame.      |

## 🧠 Example Usage
```python

```

#### 🧾 Default Output Format (Output Format)
The operator modifies the input DataFrame by replacing the text in the column specified by `input_key` with its entity-masked version. All other columns are preserved.

Example Input:
```json
{
"id": 1,
"document_text": "Apple is looking at buying U.K. startup for $1 billion in London."
}
```
Example Output (with `input_key="document_text"`):
```json
{
"id": 1,
"document_text": "[ORG] is looking at buying [GPE] startup for [$1 billion] in [GPE]."
}
```
