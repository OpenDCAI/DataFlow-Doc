---
title: Prompt Template Builder — Prompt Template Generator
createTime: 2026/04/06 00:00:00
permalink: /en/guide/skills/prompt-template-builder/
---

## 1. Overview

**Prompt Template Builder (`prompt-template-builder`)** is a Claude Code Skill for building or revising `prompt_template` classes for existing DataFlow operators. It addresses the core problem of "operator logic reuse + prompt customization" — when you want to apply the same operator to different business scenarios, you only need to create a new prompt template instead of rewriting the operator code.

This Skill can:

1. **Operator Interface Alignment**: Automatically inspect the target operator's constructor parameters and `run()` signature, ensuring the generated template fully conforms to the operator contract.
2. **Automatic Template Type Selection**: Automatically choose the appropriate template style (`DIYPromptABC` or `FormatStrPrompt`) based on the target operator type.
3. **Two-Stage Auditable Output**: First output a decision JSON (Stage 1), then the complete deliverables (Stage 2), facilitating code review and traceability.
4. **Static Acceptance Gating**: Perform quality checks via a structured acceptance checklist to ensure the template is ready for delivery.
5. **Targeted Revision**: If the result is unsatisfactory, accept feedback for targeted modifications and re-run acceptance checks.

## 2. Core Features

### 2.1 Operator Contract Alignment

This is the most important feature of the Skill. Before generating a prompt template, the Skill verifies the following:

- Whether the parameter signature of `build_prompt` matches how the target operator calls `prompt_template.build_prompt(...)`
- Whether the `prompt_template` type matches the template type expected by the operator
- Whether all variables referenced in the template come from explicit parameters or constants (no undeclared variables)

If the target operator requires `DIYPromptABC` but you mistakenly use `FormatStrPrompt`, the Skill will catch this issue during the Stage 1 phase.

### 2.2 Two-Stage Output

Generated results are strictly divided into two stages:

**Stage 1 (Decision JSON)** — Before writing any code, a structured decision record is produced:

- `prompt_template_type_aligned`: The selected template type and rationale
- `strategy`: Template design strategy (e.g., "single-field generation using system+user dual-layer prompts")
- `argument_mapping`: Mapping from parameter names to their business meanings
- `output_contract`: Output format constraints (e.g., "Chinese, no more than 80 characters")
- `static_checks`: List of static check items to be verified

**Stage 2 (Final Deliverables)** — Contains five parts:

1. Template / configuration code
2. Integration code snippet (ready to copy into a Pipeline)
3. Example walkthrough (normal case + edge case)
4. Static acceptance results
5. Residual risk statement

### 2.3 Supported Template Types

| Template Type | Applicable Operators | Characteristics |
|---------------|---------------------|-----------------|
| `DIYPromptABC` | `PromptedGenerator`, `PromptedFilter`, `PromptedRefiner`, etc. | Fully customizable system/user prompts with field interpolation; maximum flexibility |
| `FormatStrPrompt` | `FormatStrPromptedGenerator` | Uses Python f-string style templates; suitable for fixed-format scenarios with multi-field concatenation |

**How to choose:**
- If the target operator name starts with `FormatStr` (e.g., `FormatStrPromptedGenerator`), you must use `FormatStrPrompt`
- For other operators with the `Prompted` prefix (e.g., `PromptedGenerator`, `PromptedFilter`), use `DIYPromptABC`
- The binding between template type and operator contract is strict — **mixing is not allowed**

## 3. Workflow

The complete execution flow of the Skill is as follows:

1. **Load Reference Rules and Parse Input**: Read internal reference documents (input schema, output contract, acceptance checklist, etc.) and parse user-provided information.
2. **Select Mode**: Choose between interactive interview or direct Spec mode based on user input.
3. **Parse Operator Contract**: Confirm the interface definition of the target operator `OP_NAME` and determine which template type to use.
4. **Build Template Draft**: Generate prompt template code based on the operator contract and user requirements.
5. **Output Stage 1 Decision JSON**: Present the template strategy, argument mapping, output contract, and static check items.
6. **Output Stage 2 Final Deliverables**: Output template code, integration snippet, example walkthrough, and acceptance results.
7. **Run Static Acceptance**: Verify each item in the acceptance checklist one by one.
8. **Receive Feedback and Revise** (optional): If the user is unsatisfied, perform targeted modifications and repeat Stage 1 / Stage 2.

## 4. Usage Guide

### 4.1 Adding the Skill

**Prerequisites**: Claude Code CLI must be installed. For installation instructions, refer to the [Claude Code official documentation](https://code.claude.com/docs/en) or the [DataFlow-Skills README](https://github.com/haolpku/DataFlow-Skills).

Clone the repository and copy the Skill directory into Claude Code's skills folder:

```bash
git clone https://github.com/haolpku/DataFlow-Skills.git

# Project-level (available only for the current project)
cp -r DataFlow-Skills/prompt-template-builder .claude/skills/prompt-template-builder

# Or user-level (available for all projects)
cp -r DataFlow-Skills/prompt-template-builder ~/.claude/skills/prompt-template-builder
```

Claude Code automatically discovers Skills from `.claude/skills/<skill-name>/SKILL.md`. Once copied, the `/prompt-template-builder` command will be available in Claude Code.

### 4.2 Mode A: Interactive Interview

Invoke directly in Claude Code:

```
/prompt-template-builder
```

The Agent will collect all necessary information through **two rounds of batch questions**. Each question includes recommended options and rationale.

#### Round 1: Structural Fields

Determine "what to do" and "for whom":

| Question | Description | Recommendation | Mapped Field |
|----------|-------------|----------------|--------------|
| Task Type | New / Rewrite / Iterative optimization | New (most stable for first version) | `Task Mode` |
| Target Operator | Specify `OP_NAME` | Specify a single operator (avoid scope creep) | `OP_NAME` |
| Output Constraint Strength | Strong / Medium / Light constraints | Strong constraint schema (improves parsability) | `Expected Output` |
| Tone & Style | Professional & concise / Didactic / Strict audit | Professional & concise | `Tone/Style` |
| Constraint Source | Business rules / Examples / Reference cases | Business rules first | `Constraints` |

#### Round 2: Implementation Fields

Determine the "how" details:

| Question | Description | Recommendation | Mapped Field |
|----------|-------------|----------------|--------------|
| `build_prompt` Parameters | Parameter list for the template function | Explicitly list all parameters (avoid variable drift) | `Arguments` |
| Output Format Details | JSON / Text paragraph / List | JSON + explicit field types | `Expected Output` |
| Sample Coverage | Normal + edge / Normal only / Multiple edge | 1 normal + 1 edge | `Sample Cases` |
| Acceptance Focus | Interface consistency / Copy quality / Structural completeness | Interface consistency first | `Validation Focus` |

After both rounds are answered, the generation process starts automatically. Follow-up questions are only asked when `Target` or `OP_NAME` is missing, parameter-to-template-variable mappings conflict, or output constraints are contradictory.

### 4.3 Mode B: Direct Spec

If you already have a clear prompt requirement, you can skip the interview:

```
/prompt-template-builder --spec path/to/prompt_spec.json
```

#### Spec JSON Field Descriptions

**Required fields:**

| Field | Description | Example |
|-------|-------------|---------|
| `Target` | Business objective description | `"生成简洁的电商商品卖点"` |
| `OP_NAME` | Target operator class name | `"PromptedGenerator"` |

**Recommended fields:**

| Field | Description | Example |
|-------|-------------|---------|
| `Constraints` | Business constraint conditions | `"语气专业；中文不超过80字"` |
| `Expected Output` | Output format requirements | `"单行纯文本"` |
| `Arguments` | Prompt parameter list | `["product_name", "category"]` |
| `Sample Cases` | 1–3 input/expected output pairs | See example below |
| `Tone/Style` | Tone and style | `"专业简洁"` |
| `Validation Focus` | Acceptance focus area | `"接口一致性"` |

**Complete example:**

```json
{
  "Target": "生成简洁的电商商品卖点",
  "OP_NAME": "PromptedGenerator",
  "Constraints": "语气专业；中文不超过80字",
  "Expected Output": "单行纯文本",
  "Arguments": ["product_name", "category"],
  "Sample Cases": [
    {"product_name": "降噪耳机", "category": "电子产品"}
  ],
  "Tone/Style": "专业简洁",
  "Validation Focus": "接口一致性"
}
```

### 4.4 Viewing the Output

#### Stage 1: Decision JSON

A structured decision record is output first for team review:

```json
{
  "prompt_template_type_aligned": "DIYPromptABC",
  "strategy": "单字段生成，使用 system+user 双层提示词",
  "argument_mapping": {
    "product_name": "商品名",
    "category": "品类"
  },
  "output_contract": "中文，不超过 80 字，以卖点句式结尾",
  "static_checks": [
    "无多余占位符",
    "语气符合专业定义",
    "字数约束可在 Stage 2 walkthrough 中核验"
  ]
}
```

**Key rules:**
- `prompt_template_type_aligned` must match the target operator's contract
- Every item in `static_checks` must be verified one by one during the Stage 2 acceptance walkthrough
- `argument_mapping` must fully correspond to the `Arguments` field with no omissions

#### Stage 2: Final Deliverables

Using e-commerce selling point generation as an example, Stage 2 includes the following:

**1. Prompt Design Code:**

```python
system_prompt = (
    "你是电商文案助手。"  # You are an e-commerce copywriting assistant.
    "语气专业，最多80字，不使用夸张承诺。"  # Professional tone, max 80 chars, no exaggerated claims.
    "只返回一行中文文本，不要 JSON，不要额外解释。"  # Return one line of Chinese text only, no JSON, no extra explanation.
)
user_prompt = "请基于输入内容生成一句电商卖点描述："  # Generate a one-line e-commerce selling point based on the input:
```

**2. Integration Code Snippet:**

```python
self.generator = PromptedGenerator(
    llm_serving=self.llm_serving,
    system_prompt=system_prompt,
    user_prompt=user_prompt,
)
```

**3. Example Walkthrough:**
- Normal case: `降噪耳机/电子产品` → Outputs a professional selling point within 80 characters
- Edge case: `product_name` is empty → Output should indicate insufficient information; no fabricated content generated

**4. Static Acceptance Results:**
- `input_completeness` ✓
- `operator_interface_aligned` ✓
- `prompt_template_type_aligned` ✓
- `no_invented_params` ✓
- `output_schema_explicit` ✓

**5. Residual Risks:** None (this is a simple scenario)

## 5. Mode Comparison and Selection Guide

| Dimension | Interactive Interview (Mode A) | Direct Spec (Mode B) |
|-----------|-------------------------------|----------------------|
| Best for | First-time use, unclear requirements | Clear requirements, team collaboration |
| How to start | `/prompt-template-builder` | `/prompt-template-builder --spec spec.json` |
| Learning curve | Low, step-by-step guidance | Medium, requires understanding the spec format |
| Efficiency | Requires answering two rounds of questions | One-shot submission, faster |
| Reproducibility | Lower | High, spec files can be version-controlled |
| Iterative revision | Supports conversational feedback | Modify the spec and re-run |

**Selection advice:**
- If you're unsure which operator to use or how to write constraints → choose **Mode A**, the Agent will guide you step by step
- If you already have a spec from a previous run and only need minor tweaks → choose **Mode B**
- When rolling out across a team, it's recommended to version-control spec files and standardize on **Mode B** for consistency

## 6. Notes and FAQ

### 6.1 Key Considerations

**Template types must not be mixed**: `prompt_template_type_aligned` must strictly match the target operator's contract. For example, `PromptedGenerator` should use `DIYPromptABC`, while `FormatStrPromptedGenerator` must use `FormatStrPrompt`. Mixing them will cause runtime type errors or the operator failing to recognize the template.

**`build_prompt` parameters must be aligned**: The parameter signature of the template's `build_prompt` method must exactly match the parameters passed when the operator calls it (name, count, type). Mismatches will cause a `TypeError`. The Skill lists all parameter mappings in the Stage 1 `argument_mapping` — review them carefully.

**Output format must be explicit**: Avoid vague descriptions like "try to output JSON" in the prompt. You must explicitly define field names, types, and value ranges for the output. Vague output requirements lead to unstable model output that is difficult to parse.

**Template variables must not appear out of thin air**: Variables referenced in `build_prompt` must come from function parameters or class constants. If the template contains a variable not declared in the parameter list, formatting will raise a `NameError` or produce empty values.

**v1 uses static acceptance**: The current version uses a "static acceptance + example walkthrough" loop and does not automatically run subprocess tests. This means acceptance results are based on code structure checks, not runtime behavior. If you need runtime verification, you must manually integrate the generated code into a Pipeline and execute it.

### 6.2 FAQ

**Q: Getting a `TypeError` at runtime saying `build_prompt` parameters don't match?**

A: This is the most common issue. The root cause is a mismatch between the `build_prompt` parameter signature and the operator call site. Solution: (1) Check the target operator's source code or documentation for how `prompt_template.build_prompt(...)` is called; (2) Verify that `argument_mapping` in Stage 1 fully covers all parameters; (3) Use the Skill's targeted revision feature to fix the signature.

**Q: Model output is unstable and the format keeps drifting?**

A: This is usually because the output format constraints in the prompt are not strict enough. Check the following: (1) Does the prompt explicitly define the output schema (field names, types)? (2) Does it use strong constraint statements like "return only XXX, no extra explanation"? (3) Does it include a format example of the expected output at the end of the prompt?

**Q: The generated template code looks correct, but the operator doesn't recognize it?**

A: Check whether the template type matches the operator. If you used `DIYPromptABC` but the target operator expects `FormatStrPrompt` (or vice versa), the operator will ignore it or throw an error. Review the `prompt_template_type_aligned` field in Stage 1 to confirm the match.

**Q: I want to adjust the strategy after Stage 1 is output — how?**

A: Simply provide your feedback to the Agent. The Skill supports targeted revision after receiving feedback — it will preserve unchanged parts, modify only the issues you pointed out, then re-output Stage 1 and Stage 2 and re-run static acceptance.

**Q: A business requirement needs multiple prompt classes — should I split or merge?**

A: As a general principle, try to accomplish the task with a single template class. Split only when the semantic responsibilities are significantly different (e.g., one for generation and one for filtering). If the Stage 1 strategy explanation cannot justify the need for splitting, it should be merged. Over-splitting increases maintenance costs.
