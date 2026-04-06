---
title: Prompt Template Builder — 提示词模板生成
createTime: 2026/04/06 00:00:00
permalink: /zh/guide/skills/prompt-template-builder/
---

## 1. 概述

**Prompt Template Builder (`prompt-template-builder`)** 是一个 Claude Code Skill，用于为 DataFlow 已有算子构建或修订 `prompt_template`。它解决的核心问题是"算子逻辑复用 + 提示词定制"——当你想用同一个算子处理不同的业务场景时，只需定制新的 prompt 模板即可，无需重写算子代码。

该 Skill 能够：

1. **算子接口对齐**：自动检查目标算子的构造参数和 `run()` 签名，确保生成的模板与算子契约完全一致。
2. **模板类型自动选择**：根据目标算子类型，自动选择合适的模板风格（`DIYPromptABC` 或 `FormatStrPrompt`）。
3. **两阶段可审计输出**：先输出决策 JSON（Stage 1），再输出完整产物（Stage 2），方便代码评审与回溯。
4. **静态验收门控**：通过结构化验收清单完成质量检查，确保模板可交付。
5. **定向改写**：如果结果不满意，支持接收反馈后进行定向修改并重新验收。

## 2. 核心特性

### 2.1 算子契约对齐

这是该 Skill 最重要的特性。生成 prompt 模板前，Skill 会确认以下内容：

- `build_prompt` 的参数签名是否与目标算子调用 `prompt_template.build_prompt(...)` 的方式一致
- `prompt_template` 类型是否与算子期望的模板类型匹配
- 模板中引用的所有变量是否都来自显式参数或常量（无未声明变量）

如果目标算子要求使用 `DIYPromptABC` 但你误用了 `FormatStrPrompt`，Skill 会在 Stage 1 阶段就捕获这个问题。

### 2.2 两阶段输出

生成结果严格分为两个阶段：

**Stage 1（决策 JSON）**——在动手写代码之前，先输出一份结构化的决策记录：

- `prompt_template_type_aligned`：选用的模板类型及理由
- `strategy`：模板设计策略（如"单字段生成，使用 system+user 双层提示词"）
- `argument_mapping`：参数名到业务含义的映射
- `output_contract`：输出格式约束（如"中文，不超过 80 字"）
- `static_checks`：待验证的静态检查项列表

**Stage 2（最终产物）**——包含五个部分：

1. 模板/配置代码
2. 集成代码片段（直接可复制到 Pipeline 中）
3. 示例走查（正常样例 + 边界样例）
4. 静态验收结果
5. 剩余风险说明

### 2.3 支持的模板类型

| 模板类型 | 适用算子 | 特点 |
|----------|----------|------|
| `DIYPromptABC` | `PromptedGenerator`、`PromptedFilter`、`PromptedRefiner` 等 | 完全自定义 system/user prompt，支持字段插值，灵活度最高 |
| `FormatStrPrompt` | `FormatStrPromptedGenerator` | 使用 Python f-string 风格模板，适合多字段拼接的固定格式场景 |

**如何选择：**
- 如果目标算子名以 `FormatStr` 开头（如 `FormatStrPromptedGenerator`），必须使用 `FormatStrPrompt`
- 其他带 `Prompted` 前缀的算子（如 `PromptedGenerator`、`PromptedFilter`），使用 `DIYPromptABC`
- 模板类型与算子的契约是强绑定的，**不可混用**

## 3. 工作流

Skill 的完整执行流程如下：

1. **加载参考规则并解析输入**：读取内部参考文档（输入 schema、输出契约、验收清单等），解析用户提供的信息。
2. **选择模式**：根据用户输入选择交互式采访或直接 Spec 模式。
3. **解析算子契约**：确认目标算子 `OP_NAME` 的接口定义，确定应使用的模板类型。
4. **构建模板草稿**：基于算子契约和用户需求，生成 prompt 模板代码。
5. **输出 Stage 1 决策 JSON**：展示模板策略、参数映射、输出契约和静态检查项。
6. **输出 Stage 2 完整产物**：输出模板代码、集成片段、示例走查和验收结果。
7. **运行静态验收**：逐项核验 acceptance-checklist 中的检查项。
8. **接收反馈并改写**（可选）：如果用户不满意，执行定向修改并重复 Stage 1/Stage 2。

## 4. 使用指南

### 4.1 添加 Skill

**前置条件**：需要已安装 Claude Code CLI。安装方法请参考 [Claude Code 官方文档](https://code.claude.com/docs/zh-CN) 或 [DataFlow-Skills README](https://github.com/haolpku/DataFlow-Skills)。

克隆仓库并将 Skill 目录复制到 Claude Code 的 skills 文件夹中：

```bash
git clone https://github.com/haolpku/DataFlow-Skills.git

# 项目级（仅当前项目可用）
cp -r DataFlow-Skills/prompt-template-builder .claude/skills/prompt-template-builder

# 或个人级（所有项目可用）
cp -r DataFlow-Skills/prompt-template-builder ~/.claude/skills/prompt-template-builder
```

Claude Code 从 `.claude/skills/<skill-name>/SKILL.md` 自动发现 Skills。复制完成后，在 Claude Code 中即可使用 `/prompt-template-builder` 命令。

### 4.2 方式 A：交互式采访

直接在 Claude Code 中调用：

```
/prompt-template-builder
```

Agent 会通过 **两轮批量提问** 采集全部必要信息。每个问题附带推荐选项和理由。

#### 第 1 轮：结构字段

确定"做什么"和"给谁做"：

| 问题 | 说明 | 推荐 | 映射字段 |
|------|------|------|----------|
| 任务类型 | 新建 / 改写 / 迭代优化 | 新建（首版最稳） | `Task Mode` |
| 目标算子 | 指定 `OP_NAME` | 指定单一算子（避免职责扩散） | `OP_NAME` |
| 输出约束强度 | 强约束 / 中约束 / 轻约束 | 强约束 schema（提升可解析性） | `Expected Output` |
| 风格与语气 | 专业简洁 / 教学解释型 / 严格审计型 | 专业简洁 | `Tone/Style` |
| 约束来源 | 业务规则 / 样例 / 参考案例 | 业务规则优先 | `Constraints` |

#### 第 2 轮：实现字段

确定"怎么做"的细节：

| 问题 | 说明 | 推荐 | 映射字段 |
|------|------|------|----------|
| `build_prompt` 入参 | 模板函数的参数列表 | 显式列出全部参数（避免变量漂移） | `Arguments` |
| 输出格式细节 | JSON / 文本段落 / 列表 | JSON + 明确字段类型 | `Expected Output` |
| 样例覆盖 | 正常 + 边界 / 仅正常 / 多边界 | 1 正常 + 1 边界 | `Sample Cases` |
| 验收重点 | 接口一致性 / 文案质量 / 结构完整 | 接口一致性优先 | `Validation Focus` |

两轮提问回答完毕后自动进入生成流程。仅在 `Target` 或 `OP_NAME` 缺失、参数与模板变量映射冲突、输出约束互相矛盾时才会追问。

### 4.3 方式 B：直接指定 Spec

如果你已经有明确的 prompt 需求，可以跳过采访：

```
/prompt-template-builder --spec path/to/prompt_spec.json
```

#### Spec JSON 字段说明

**必填字段：**

| 字段 | 说明 | 示例 |
|------|------|------|
| `Target` | 业务目标描述 | `"生成简洁的电商商品卖点"` |
| `OP_NAME` | 目标算子类名 | `"PromptedGenerator"` |

**建议补充字段：**

| 字段 | 说明 | 示例 |
|------|------|------|
| `Constraints` | 业务约束条件 | `"语气专业；中文不超过80字"` |
| `Expected Output` | 输出格式要求 | `"单行纯文本"` |
| `Arguments` | prompt 参数列表 | `["product_name", "category"]` |
| `Sample Cases` | 1-3 条输入/预期输出 | 见下方示例 |
| `Tone/Style` | 语气风格 | `"专业简洁"` |
| `Validation Focus` | 验收关注点 | `"接口一致性"` |

**完整示例：**

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

### 4.4 查看输出

#### Stage 1：决策 JSON

首先输出一份结构化的决策记录，供团队评审：

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

**核心规则：**
- `prompt_template_type_aligned` 必须与目标算子的契约匹配
- `static_checks` 中每一项必须在 Stage 2 的验收走查中逐一核验
- `argument_mapping` 需与 `Arguments` 字段完全对应，不可遗漏

#### Stage 2：最终产物

以电商卖点生成为例，Stage 2 包含以下内容：

**1. Prompt 设计代码：**

```python
system_prompt = (
    "你是电商文案助手。"
    "语气专业，最多80字，不使用夸张承诺。"
    "只返回一行中文文本，不要 JSON，不要额外解释。"
)
user_prompt = "请基于输入内容生成一句电商卖点描述："
```

**2. 集成代码片段：**

```python
self.generator = PromptedGenerator(
    llm_serving=self.llm_serving,
    system_prompt=system_prompt,
    user_prompt=user_prompt,
)
```

**3. 示例走查：**
- 正常样例：`降噪耳机/电子产品` → 输出一条 80 字内的专业卖点文案
- 边界样例：`product_name` 为空 → 输出应提示信息不足，不生成虚假内容

**4. 静态验收结果：**
- `input_completeness` ✓
- `operator_interface_aligned` ✓
- `prompt_template_type_aligned` ✓
- `no_invented_params` ✓
- `output_schema_explicit` ✓

**5. 剩余风险：** 无（本例为简单场景）

## 5. 模式对比与选择建议

| 对比维度 | 交互式采访（Mode A） | 直接 Spec（Mode B） |
|----------|---------------------|---------------------|
| 适合场景 | 首次使用、需求不明确 | 需求已明确、团队协作 |
| 启动方式 | `/prompt-template-builder` | `/prompt-template-builder --spec spec.json` |
| 上手难度 | 低，逐步引导 | 中，需了解 spec 格式 |
| 效率 | 需要回答两轮问题 | 一次性提交，更快 |
| 可复现性 | 较低 | 高，spec 可版本管理 |
| 迭代改写 | 支持对话式反馈改写 | 修改 spec 后重新运行 |

**选择建议：**
- 如果你不确定该用哪个算子或怎么写约束 → 选 **Mode A**，Agent 会引导你一步步明确
- 如果你已经有上次生成的 spec，只需微调后复用 → 选 **Mode B**
- 团队内推广时，建议将 spec 文件纳入版本管理，统一用 **Mode B** 保持一致性

## 6. 注意事项与常见问题

### 6.1 关键注意事项

**模板类型不可混用**：`prompt_template_type_aligned` 必须与目标算子的契约严格匹配。例如 `PromptedGenerator` 应使用 `DIYPromptABC`，而 `FormatStrPromptedGenerator` 必须使用 `FormatStrPrompt`。混用会导致运行时报类型错误或算子不识别模板。

**`build_prompt` 参数必须对齐**：模板的 `build_prompt` 方法的参数签名必须与算子调用时传入的参数完全一致（名称、数量、类型）。不一致会导致 `TypeError`。Skill 会在 Stage 1 的 `argument_mapping` 中列出所有参数映射，请仔细确认。

**输出格式必须明确**：不要在 prompt 中写"尽量输出 JSON"这样的模糊描述。必须明确定义输出的字段名、类型、取值范围。模糊的输出要求会导致模型输出不稳定，难以解析。

**模板变量不可"凭空出现"**：`build_prompt` 中引用的变量必须来自函数参数或类常量。如果模板中出现了未在参数列表中声明的变量，格式化时会报 `NameError` 或产生空值。

**v1 为静态验收**：当前版本使用"静态验收 + 示例走查"闭环，不会自动运行子进程测试。这意味着验收结果是基于代码结构检查而非运行时行为。如果需要运行时验证，需手动将生成的代码集成到 Pipeline 中执行。

### 6.2 常见问题

**Q：运行时报 `TypeError`，提示 `build_prompt` 参数不匹配？**

A：这是最常见的问题。根因是 `build_prompt` 的参数签名与算子调用点不一致。解决方法：(1) 确认目标算子的源码或文档中 `prompt_template.build_prompt(...)` 的调用方式；(2) 检查 Stage 1 中的 `argument_mapping` 是否完整覆盖了所有参数；(3) 使用 Skill 的定向改写功能修正签名。

**Q：模型输出不稳定，格式总是漂移？**

A：通常是 prompt 中的输出格式约束不够严格。检查以下几点：(1) 是否在 prompt 中明确定义了输出 schema（字段名、类型）；(2) 是否使用了"只返回 XXX，不要额外解释"之类的强约束语句；(3) 是否在 prompt 末尾给出了预期输出的格式示例。

**Q：生成的模板代码看似正确，但算子不识别？**

A：检查模板类型是否与算子匹配。如果使用了 `DIYPromptABC` 但目标算子期望 `FormatStrPrompt`（或反之），算子会忽略或报错。查看 Stage 1 中的 `prompt_template_type_aligned` 字段确认匹配关系。

**Q：Stage 1 输出后想调整策略，怎么做？**

A：直接向 Agent 反馈你的修改意见。Skill 支持接收反馈后进行定向改写——它会保留未变更的部分，只修改你指出的问题，然后重新输出 Stage 1 和 Stage 2 并重新运行静态验收。

**Q：一个业务需求需要多个 prompt 类，该拆分还是合并？**

A：原则上应尽量用一个模板类完成。仅在语义职责显著不同时才拆分（例如一个用于生成、一个用于过滤）。如果 Stage 1 的策略解释无法给出拆分的必要性理由，说明应该合并。过度拆分会增加维护成本。
