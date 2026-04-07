---
title: Operator Builder — Operator Scaffold Generator
createTime: 2026/04/06 00:00:00
permalink: /en/guide/skills/dataflow-operator-builder/
---

Video tutorial: [Build DataFlow Operator](https://files.catbox.moe/uzk3ag.mp4)

## 1. Overview

**Operator Builder (`dataflow-operator-builder`)** is a Claude Code Skill that generates a complete, production-grade scaffold for custom DataFlow operators in one step. It targets developers who frequently create new operators, automating the repetitive workflow of "define spec → generate code → register → test."

The Skill can:

1. **Spec Validation**: Statically check the operator spec before code generation, catching common issues such as registration conflicts, contract violations, and naming errors early.
2. **Skeleton Generation**: Produce standardized operator implementation code based on the operator type (`generate` / `filter` / `refine` / `eval`).
3. **CLI Entry Generation**: Automatically create a standalone command-line entry script under the `cli/` directory for batch processing and independent testing.
4. **Test File Generation**: Generate three categories of test baselines — `unit` / `registry` / `smoke` — ready to plug into CI.
5. **Safe Write**: Preview the file plan via `--dry-run` first, then write only after confirmation, with multiple overwrite strategies available.

## 2. Core Features

### 2.1 Two Working Modes

The Skill offers two startup methods to fit different scenarios:

- **Interactive Interview (Mode A)**: Invoke `/dataflow-operator-builder` directly. The Agent collects all spec information through two rounds of batch questions — no files need to be prepared in advance. Ideal for first-time use or when you are unsure about the parameters.
- **Direct Spec (Mode B)**: Provide a JSON spec file and skip the interview to generate immediately. Best when you already have a clear spec or need to create operators in bulk.

### 2.2 Two-Stage Output

To ensure safety and auditability, the generation process is split into two stages:

1. **Dry-run Stage**: Outputs the complete file creation/update plan, listing every file path and its status (CREATE / UPDATE), without writing anything.
2. **Generation Stage**: Actual file writes are executed only after confirmation, with an optional validation pass (`basic` or `full`) to verify correctness.

### 2.3 Multi-Level Validation

After generation, validation can be run at three levels:

| Validation Level | Checks Performed | Recommended Use |
|------------------|------------------|-----------------|
| `none` | No validation | Quick prototyping |
| `basic` | Module importable + class registered + test files exist | Day-to-day development |
| `full` | `basic` + run smoke tests + inspect output artifacts | Before formal submission (recommended) |

## 3. Workflow

The full execution flow of the Skill is as follows:

1. **Load Reference Rules**: Read internal constraint documents (operator contracts, registration rules, CLI conventions, acceptance checklists, etc.).
2. **Select Mode**: Choose interactive interview or direct Spec mode based on user input.
3. **Build Spec JSON**: Normalize the collected information into a spec JSON object.
4. **Dry-run Preview**: Display the file plan, listing files to be created or updated.
5. **Confirm Write Strategy**: Present the overwrite strategy and require explicit user confirmation (`y/N`).
6. **Generate Files**: Execute the actual code generation and file writes.
7. **Run Validation**: Execute validation at the selected level.
8. **Output Report**: Summarize the generated file paths, validation results, and suggested follow-up commands.

## 4. Usage Guide

### 4.1 Adding the Skill

**Prerequisites**: Claude Code CLI must already be installed. Refer to the [Claude Code official documentation](https://code.claude.com/docs/en) or the [DataFlow-Skills README](https://github.com/haolpku/DataFlow-Skills) for installation instructions.

Clone the repository and copy the Skill directory into Claude Code's skills folder:

```bash
git clone https://github.com/haolpku/DataFlow-Skills.git

# Project-level (available only in the current project)
cp -r DataFlow-Skills/dataflow-operator-builder .claude/skills/dataflow-operator-builder

# Or user-level (available across all projects)
cp -r DataFlow-Skills/dataflow-operator-builder ~/.claude/skills/dataflow-operator-builder
```

Claude Code automatically discovers Skills from `.claude/skills/<skill-name>/SKILL.md`. Once the copy is complete, the `/dataflow-operator-builder` command becomes available in Claude Code.

### 4.2 Mode A: Interactive Interview

Invoke directly inside Claude Code:

```
/dataflow-operator-builder
```

The Agent collects all required information through **two rounds of batch questions**. Each question comes with recommended options and a brief rationale — simply choose or fill in your answers.

#### Round 1: Structural Fields

This round determines the operator's "skeleton" information:

| Question | Description | Recommendation | Maps to Spec Field |
|----------|-------------|----------------|-------------------|
| Operator type | `generate` / `filter` / `refine` / `eval` | `generate` (most common) | `operator_type` |
| Operator identifier | Class name + module file name | Fill in as needed | `operator_class_name`, `operator_module_name` |
| Repository location | Package name + output root directory | Fill in as needed | `package_name` + `--output-root` |
| LLM dependency | Whether the operator needs to call a large model | Choose `yes` for generate/refine/eval types | `uses_llm` |
| CLI module name | File name for the command-line entry | `<module_name>_cli` (default) | `cli_module_name` |

#### Round 2: Implementation Details

This round determines runtime behavior:

| Question | Description | Recommendation | Maps to Spec Field |
|----------|-------------|----------------|-------------------|
| Input/output fields | Column names in the dataframe | Specify explicitly | `input_key`, `output_key` |
| Description language | Language support for `get_desc()` | Bilingual (Chinese & English) | Generation preference |
| Extra CLI arguments | Whether custom command-line arguments are needed | Use defaults only | Extension notes |
| Test prefix | Prefix for test file names | Same as module name | `test_file_prefix` |
| Overwrite strategy | How to handle existing files | `ask-each` (safest) | `overwrite_strategy` |
| Validation level | Validation rigor after generation | `full` (recommended) | `validation_level` |

After both rounds are answered, the Agent automatically builds the spec and enters the generation flow. Follow-up questions are only asked when a high-impact field is missing or conflicts are detected.

### 4.3 Mode B: Direct Spec

If you already have a clear operator spec, you can skip the interview and pass the spec file directly:

```
/dataflow-operator-builder --spec path/to/spec.json --output-root path/to/repo
```

#### Spec JSON Field Reference

**Required fields:**

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `package_name` | string | Package the operator belongs to | `"dataflow_ext_demo"` |
| `operator_type` | string | Operator type: `generate` / `filter` / `refine` / `eval` | `"filter"` |
| `operator_class_name` | string | Operator class name (PascalCase) | `"DemoQualityFilter"` |
| `operator_module_name` | string | Operator module file name (snake_case, without .py) | `"demo_quality_filter"` |
| `input_key` | string | Input data column name | `"raw_text"` |
| `output_key` | string | Output data column name | `"is_valid"` |
| `uses_llm` | boolean | Whether an LLM service is required | `false` |

**Optional fields:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `cli_module_name` | string | `<operator_module_name>_cli` | CLI entry file name |
| `test_file_prefix` | string | `<operator_module_name>` | Prefix for test file names |
| `overwrite_strategy` | string | `"ask-each"` | Overwrite strategy: `ask-each` / `overwrite-all` / `skip-existing` |
| `validation_level` | string | `"full"` | Validation level: `none` / `basic` / `full` |

**Full example:**

```json
{
  "package_name": "dataflow_ext_demo",
  "operator_type": "filter",
  "operator_class_name": "DemoQualityFilter",
  "operator_module_name": "demo_quality_filter",
  "input_key": "raw_text",
  "output_key": "is_valid",
  "uses_llm": false,
  "cli_module_name": "demo_quality_filter_cli",
  "test_file_prefix": "demo_quality_filter",
  "overwrite_strategy": "ask-each",
  "validation_level": "full"
}
```

### 4.4 Viewing the Output

#### Generated Artifacts

| Artifact | Path | Description |
|----------|------|-------------|
| Operator implementation | `<package>/<module_name>.py` | Class definition, `run()` method signature, and `OPERATOR_REGISTRY` registration entry |
| CLI entry | `cli/<cli_module_name>.py` | Standalone command-line batch script, invoked via `--input-file` / `--output-file` |
| Unit tests | `tests/unit/test_<prefix>.py` | Basic functionality tests |
| Registry tests | `tests/registry/test_<prefix>_registry.py` | Verifies the operator is correctly registered in `OPERATOR_REGISTRY` |
| Smoke tests | `tests/smoke/test_<prefix>_smoke.py` | End-to-end minimal acceptance using a temporary `FileStorage` for a full run |

#### Generated Operator Skeleton

All generated operators follow a uniform structure:

```python
from dataflow.operators.base import BaseOperator
from dataflow.utils.storage import FileStorage

class DemoQualityFilter(BaseOperator):
    def __init__(self, threshold: float = 0.5):
        self.threshold = threshold

    def run(self, storage: FileStorage) -> FileStorage:
        # Implement filtering logic here
        ...
        return storage

# Registration entry (auto-generated by the Skill)
OPERATOR_REGISTRY.register("DemoQualityFilter", DemoQualityFilter)
```

**Key rules:**
- Must inherit from `BaseOperator` and implement the `run()` method
- `run()` accepts and returns a `FileStorage` instance to maintain chainable passing
- Must register via `OPERATOR_REGISTRY` so the operator can be discovered by Pipelines
- The CLI entry invokes `run()` directly through `--input-file` / `--output-file` arguments, decoupled from the Pipeline context
- `get_desc(lang)` must support bilingual output (`zh` / `en`)

#### Common CLI Arguments

| Argument | Description | Possible Values |
|----------|-------------|-----------------|
| `--dry-run` | Show the file plan only; do not write any files | — |
| `--overwrite` | Control overwrite behavior for existing files | `ask-each` (confirm one by one) / `overwrite-all` (overwrite everything) / `skip-existing` (skip existing files) |
| `--validation-level` | Validation rigor after generation | `none` / `basic` / `full` |
| `--log-dir` | Path for storing run logs | Custom path |
| `--no-log` | Disable run logging | — |

## 5. Mode Comparison and Recommendations

| Dimension | Interactive Interview (Mode A) | Direct Spec (Mode B) |
|-----------|-------------------------------|---------------------|
| Best for | First-time use, uncertain parameters | Spec already defined, bulk creation |
| Invocation | `/dataflow-operator-builder` | `/dataflow-operator-builder --spec spec.json` |
| Learning curve | Low — step-by-step guidance | Medium — requires familiarity with spec format |
| Flexibility | High — each field can be adjusted individually | High — programmable and scriptable |
| Efficiency | Requires answering two rounds of questions | Single submission, faster |
| Reproducibility | Lower — depends on the conversation | High — spec file can be version-controlled |

**Recommendations:**
- If this is your first time or you are unsure about the parameters → choose **Mode A**
- If you have used it before and saved a spec, or need to generate multiple operators in bulk → choose **Mode B**
- For team collaboration, it is recommended to version-control the spec file and standardize on **Mode B**

## 6. Notes and FAQ

### 6.1 Important Notes

**Registration must be complete**: The generated operator must be registered via the `@OPERATOR_REGISTRY.register()` decorator; otherwise the Pipeline will not be able to discover it. If the registry test fails, first check whether the decorator is present and whether the module is correctly imported.

**`storage.step()` must not be omitted**: When invoking an operator from the CLI or a Pipeline, you must pass `storage=storage.step()` rather than the raw `storage`. Omitting `step()` will cause the operator to read empty data or write output files to unexpected paths.

**Input fields must align**: `input_key` must be an existing column name in the input dataframe. If you encounter a `KeyError` at runtime, check whether the `input_key` in the spec matches the actual data column name.

**Review the overwrite strategy**: When working in a repository with existing code, always inspect the file list during the dry-run stage. The `ask-each` strategy is recommended so you can confirm each file individually — overwrite or skip.

**Use `full` validation level**: The `full` level actually runs smoke tests and inspects output artifacts, catching most issues before submission. Only downgrade to `none` or `basic` during rapid prototyping.

### 6.2 FAQ

**Q: The operator cannot be found in `OPERATOR_REGISTRY` after generation?**

A: This is usually caused by one of the following: (1) the `@OPERATOR_REGISTRY.register()` decorator is missing; (2) the operator module is not imported (check the `TYPE_CHECKING` block in `__init__.py`); (3) the class name is misspelled. Running the registry test (`test_<prefix>_registry.py`) can pinpoint the issue quickly.

**Q: Smoke tests pass but CLI execution fails?**

A: Check whether the CLI entry script correctly calls `storage.step()`, and whether the file pointed to by `--input-file` exists and is in the correct format (JSONL). The CLI and operator logic should remain decoupled — if the CLI contains operator-internal logic, the separation of concerns is broken.

**Q: Errors when processing LLM responses (empty output, unexpected format)?**

A: If the operator uses an LLM (`uses_llm: true`), you need to add defensive handling for model return values in `run()`. The generated skeleton includes helper methods (e.g., `_generate_text`, `_score_with_llm`); you should handle `None`, empty strings, and unexpected formats as fallbacks within those methods.

**Q: `--overwrite-all` accidentally overwrote existing files?**

A: The Skill displays the file plan and asks for confirmation before writing. If files were indeed overwritten by mistake, recover them via `git checkout`. Prevention measures: (1) always run `--dry-run` first; (2) use the `ask-each` or `skip-existing` strategy.
