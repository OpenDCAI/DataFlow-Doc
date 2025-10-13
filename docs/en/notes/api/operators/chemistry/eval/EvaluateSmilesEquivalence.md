---
title: EvaluateSmilesEquivalence
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/chemistry/eval/evaluatesmilesequivalence/
---

## 📘 EvaluateSmilesEquivalence
The `EvaluateSmilesEquivalence` operator is designed to assess the equivalence of SMILES (Simplified Molecular-Input Line-Entry System) strings. For each row in the input data, it compares a list of "golden" (ground truth) SMILES against a list of synthesized SMILES. The comparison is done by canonicalizing both SMILES strings using RDKit and checking for equality. The operator then calculates and outputs detailed results, block-level scores, and an overall summary of the evaluation.

## \_\_init\_\_
```python
def __init__(self, llm_serving: LLMServingABC = None)
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **llm_serving** | LLMServingABC | None | Large language model serving instance. Note: This parameter is not used by this operator. |

## Prompt Template Descriptions

## run
```python
def run(self, storage: DataFlowStorage, golden_key: str = "golden_label", synth_key: str = "synth_smiles", output_key: str = "final_result")
```
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **storage** | DataFlowStorage | Required | Data flow storage instance for reading and writing data. |
| **golden_key** | str | "golden_label" | The column name in the input data that contains the ground truth SMILES information. |
| **synth_key** | str | "synth_smiles" | The column name in the input data that contains the synthesized SMILES to be evaluated. |
| **output_key** | str | "final_result" | The column name where the detailed list of comparison results will be stored. |

## 🧠 Example Usage

#### 🧾 Output Format
The `run` function adds the following columns to the DataFrame in the storage:

| Field | Type | Description |
| :--- | :--- | :--- |
| final\_result | list[dict] | A list of dictionaries, each containing the evaluation result for one SMILES string. Each dictionary includes `abbreviation`, `full_name`, `smiles`, and a `score` (1 for a match, 0 otherwise). |
| block\_score | int | The total number of correct SMILES matches for the row. |
| block\_total | int | The total number of ground truth SMILES entries for the row. |
| block\_accuracy | float | The accuracy for the row, calculated as `block_score / block_total`. |
