---
title: CodeSandboxSampleEvaluator
createTime: 2025/10/09 16:52:48
permalink: /en/api/operators/code/eval/codesandboxsampleevaluator/
---

## 📘 Overview
`CodeSandboxSampleEvaluator` is an operator that executes code snippets in a secure, isolated environment to verify their correctness. It leverages a robust PythonExecutor to handle process isolation, timeouts, and capturing results. This is the final validation step in the data synthesis pipeline.

## __init__
```python
def __init__(self, language: str = "python", timeout_length: int = 15, use_process_isolation: bool = True)
```

| Parameter Name | Type | Default Value | Description |
| :------------------ | :---- | :------- | :--------------------------------------------------------------------------------- |
| **language** | str | "python" | The programming language of the code snippets. Currently, only "python" is supported. |
| **timeout_length** | int | 15 | Maximum execution time in seconds for each code snippet. |
| **use_process_isolation** | bool | True | Whether to run code in a separate process for security. Recommended to keep True. |

### Prompt Template Descriptions
| Prompt Template Name | Main Purpose | Applicable Scenarios | Feature Description |
| :--- | :--- | :--- | :--- |
| | | | |

## run
```python
def run(self, storage: DataFlowStorage, input_key: str, output_status_key: str = "sandbox_status", output_log_key: str = "sandbox_log")
```

| Name | Type | Default Value | Description |
| :------------- | :---------------- | :---------------- | :--------------------------------------- |
| **storage** | DataFlowStorage | Required | Data storage object. |
| **input_key** | str | Required | Field name containing code snippets. |
| **output_status_key** | str | "sandbox_status" | Field name for execution status. |
| **output_log_key** | str | "sandbox_log" | Field name for execution logs. |

## 🧠 Example Usage
```python

```

#### 🧾 Default Output Format
| Field | Type | Description |
| :---------------- | :--- | :------------------------------------------- |
| `[input_key]` | str | The input code snippet. |
| `sandbox_status` | str | Execution status ('PASS' or 'FAIL'). |
| `sandbox_log` | str | The execution output, log, or error message. |

**Example Input:**
```json
{
    "generated_code": "def calculate_sum(a, b):\n    return a + b\n\nprint(calculate_sum(5, 10))"
}
```
**Example Output:**
```json
{
    "generated_code": "def calculate_sum(a, b):\n    return a + b\n\nprint(calculate_sum(5, 10))",
    "sandbox_status": "PASS",
    "sandbox_log": "15\n"
}
```
