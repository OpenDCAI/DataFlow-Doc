---
title: RAREBM25HardNegGenerator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/rare/generate/rarebm25hardneggenerator/
---

## 📘 Overview
The `RAREBM25HardNegGenerator` operator mines hard negatives for a given query using the BM25 algorithm. It reads a dataframe containing queries and their corresponding positive documents, processes them to find relevant negative examples, and appends a new column with the mined hard negatives to the dataframe.

## __init__ function
```python
def __init__(self)
```

## run function
```python
def run(self, storage: DataFlowStorage, input_question_key: str = "question", input_text_key: str = "text", output_negatives_key: str = "hard_negatives", num_neg: int = 3)
```
#### Parameters
| Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | Data flow storage instance, responsible for reading and writing data. |
| **input_question_key** | str | "question" | Field name containing the query. |
| **input_text_key** | str | "text" | Field name containing the positive document text. |
| **output_negatives_key** | str | "hard_negatives" | Field name for storing the list of mined hard negatives. |
| **num_neg** | int | 3 | The number of hard negatives to mine for each query. |

## 🧠 Example Usage
```python

```

#### 🧾 Default Output Format (Output Format)
The operator adds a new column (default name: `hard_negatives`) to the input dataframe.

| Field | Type | Description |
| :--- | :--- | :--- |
| question | str | The input query text (retained from input). |
| text | str | The input positive document text (retained from input). |
| hard_negatives | list[str] | A list of mined hard negative document texts. |

**Example Input:**
```json
{
"question": "What is the BM25 algorithm?",
"text": "Okapi BM25 is a ranking function used by search engines to rank matching documents according to their relevance to a given search query."
}
```
**Example Output:**
```json
{
"question": "What is the BM25 algorithm?",
"text": "Okapi BM25 is a ranking function used by search engines to rank matching documents according to their relevance to a given search query.",
"hard_negatives": [
    "A hard negative document text that is relevant to the query but not the correct answer.",
    "Another closely related but incorrect document text.",
    "A third document that uses similar keywords but discusses a different topic."
]
}
```
