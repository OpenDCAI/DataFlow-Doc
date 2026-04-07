---
title: Operator Builder — 算子脚手架生成
createTime: 2026/04/06 00:00:00
permalink: /zh/guide/skills/dataflow-operator-builder/
---

视频教程：[Build DataFlow Operator](https://files.catbox.moe/uzk3ag.mp4)

## 1. 概述

**Operator Builder (`dataflow-operator-builder`)** 是一个 Claude Code Skill，用于一键生成生产级 DataFlow 自定义算子的完整脚手架。它面向需要频繁创建新算子的开发者，将"定义规格 → 生成代码 → 注册 → 测试"这一重复流程自动化。

该 Skill 能够：

1. **规格校验**：在生成代码前，对算子规格（spec）进行静态检查，提前暴露注册、契约、命名等常见问题。
2. **骨架生成**：根据算子类型（`generate` / `filter` / `refine` / `eval`），生成标准化的算子实现代码。
3. **CLI 入口生成**：在 `cli/` 目录下自动创建独立的命令行入口脚本，便于批处理和独立测试。
4. **测试文件生成**：同步生成 `unit` / `registry` / `smoke` 三类测试基线，可直接接入 CI。
5. **安全写入**：先通过 `--dry-run` 预览文件计划，确认后再写入，支持多种覆盖策略。

## 2. 核心特性

### 2.1 两种工作模式

Skill 提供两种启动方式，适配不同场景：

- **交互式采访（Mode A）**：直接调用 `/dataflow-operator-builder`，Agent 通过两轮批量提问自动采集规格信息，无需提前准备任何文件。适合首次使用或不确定参数的场景。
- **直接指定 Spec（Mode B）**：提供一个 JSON 格式的 spec 文件，跳过采访直接生成。适合已有明确规格或需要批量创建的场景。

### 2.2 两阶段输出

为保证安全性和可审查性，生成过程分为两个阶段：

1. **Dry-run 阶段**：输出完整的文件创建/更新计划，列出所有将生成的文件路径和状态（CREATE / UPDATE），不写入任何文件。
2. **生成阶段**：确认后才执行实际文件写入，并可选择运行校验（`basic` 或 `full`）验证生成结果的正确性。

### 2.3 多层级校验

生成完成后可执行校验，分为三个级别：

| 校验级别 | 检查内容 | 适用场景 |
|----------|----------|----------|
| `none` | 不校验 | 快速原型 |
| `basic` | 模块可导入 + 类已注册 + 测试文件存在 | 日常开发 |
| `full` | `basic` + 运行冒烟测试 + 检查输出产物 | 正式提交前（推荐） |

## 3. 工作流

Skill 的完整执行流程如下：

1. **加载参考规则**：读取内部约束文档（算子契约、注册规则、CLI 规范、验收清单等）。
2. **选择模式**：根据用户输入选择交互式采访或直接 Spec 模式。
3. **构建 Spec JSON**：将采集到的信息标准化为 spec JSON 对象。
4. **Dry-run 预览**：展示文件计划，列出将创建或更新的文件。
5. **确认写入策略**：展示覆盖策略，要求用户显式确认（`y/N`）。
6. **生成文件**：执行实际的代码生成与写入。
7. **运行校验**：按选定级别执行校验。
8. **输出报告**：汇总生成的文件路径、校验结果和后续建议命令。

## 4. 使用指南

### 4.1 添加 Skill

**前置条件**：需要已安装 Claude Code CLI。安装方法请参考 [Claude Code 官方文档](https://code.claude.com/docs/zh-CN) 或 [DataFlow-Skills README](https://github.com/haolpku/DataFlow-Skills)。

克隆仓库并将 Skill 目录复制到 Claude Code 的 skills 文件夹中：

```bash
git clone https://github.com/haolpku/DataFlow-Skills.git

# 项目级（仅当前项目可用）
cp -r DataFlow-Skills/dataflow-operator-builder .claude/skills/dataflow-operator-builder

# 或个人级（所有项目可用）
cp -r DataFlow-Skills/dataflow-operator-builder ~/.claude/skills/dataflow-operator-builder
```

Claude Code 从 `.claude/skills/<skill-name>/SKILL.md` 自动发现 Skills。复制完成后，在 Claude Code 中即可使用 `/dataflow-operator-builder` 命令。

### 4.2 方式 A：交互式采访

直接在 Claude Code 中调用：

```
/dataflow-operator-builder
```

Agent 会通过 **两轮批量提问** 采集全部必要信息。每个问题都附带推荐选项和简短理由，你只需选择或填写即可。

#### 第 1 轮：结构字段

这一轮确定算子的"骨架"信息：

| 问题 | 说明 | 推荐 | 映射到 Spec 字段 |
|------|------|------|------------------|
| 算子类型 | `generate` / `filter` / `refine` / `eval` | `generate`（最常见） | `operator_type` |
| 算子标识 | 类名 + 模块文件名 | 按需填写 | `operator_class_name`, `operator_module_name` |
| 仓库位置 | 包名 + 输出根目录 | 按需填写 | `package_name` + `--output-root` |
| LLM 依赖 | 算子是否需要调用大模型 | 生成/精炼/评估类选 `yes` | `uses_llm` |
| CLI 模块名 | 命令行入口的文件名 | `<module_name>_cli`（默认） | `cli_module_name` |

#### 第 2 轮：实现细节

这一轮确定运行时行为：

| 问题 | 说明 | 推荐 | 映射到 Spec 字段 |
|------|------|------|------------------|
| 输入/输出字段 | dataframe 中的列名 | 显式指定 | `input_key`, `output_key` |
| 描述语言 | `get_desc()` 的语言支持 | 中英双语 | 生成偏好 |
| 额外 CLI 参数 | 是否需要自定义命令行参数 | 仅使用默认参数 | 扩展备注 |
| 测试前缀 | 测试文件名前缀 | 与模块名一致 | `test_file_prefix` |
| 覆盖策略 | 已有文件的处理方式 | `ask-each`（最安全） | `overwrite_strategy` |
| 校验级别 | 生成后的校验强度 | `full`（推荐） | `validation_level` |

两轮提问全部回答后，Agent 会自动构建 spec 并进入生成流程。仅在高影响字段缺失或存在冲突时才会进行追问。

### 4.3 方式 B：直接指定 Spec

如果你已经有明确的算子规格，可以跳过采访，直接传入 spec 文件：

```
/dataflow-operator-builder --spec path/to/spec.json --output-root path/to/repo
```

#### Spec JSON 字段说明

**必填字段：**

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `package_name` | string | 算子所在包名 | `"dataflow_ext_demo"` |
| `operator_type` | string | 算子类型：`generate` / `filter` / `refine` / `eval` | `"filter"` |
| `operator_class_name` | string | 算子类名（PascalCase） | `"DemoQualityFilter"` |
| `operator_module_name` | string | 算子模块文件名（snake_case，不含 .py） | `"demo_quality_filter"` |
| `input_key` | string | 输入数据列名 | `"raw_text"` |
| `output_key` | string | 输出数据列名 | `"is_valid"` |
| `uses_llm` | boolean | 是否需要 LLM 服务 | `false` |

**可选字段：**

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `cli_module_name` | string | `<operator_module_name>_cli` | CLI 入口文件名 |
| `test_file_prefix` | string | `<operator_module_name>` | 测试文件名前缀 |
| `overwrite_strategy` | string | `"ask-each"` | 覆盖策略：`ask-each` / `overwrite-all` / `skip-existing` |
| `validation_level` | string | `"full"` | 校验级别：`none` / `basic` / `full` |

**完整示例：**

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

### 4.4 查看输出

#### 生成物一览

| 生成物 | 路径 | 说明 |
|--------|------|------|
| 算子实现 | `<package>/<module_name>.py` | 类定义、`run()` 方法签名与 `OPERATOR_REGISTRY` 注册入口 |
| CLI 入口 | `cli/<cli_module_name>.py` | 独立命令行批处理脚本，通过 `--input-file` / `--output-file` 调用 |
| 单元测试 | `tests/unit/test_<prefix>.py` | 基础功能测试 |
| 注册测试 | `tests/registry/test_<prefix>_registry.py` | 验证算子已正确注册到 `OPERATOR_REGISTRY` |
| 冒烟测试 | `tests/smoke/test_<prefix>_smoke.py` | 端到端最小验收，使用临时 `FileStorage` 执行一次完整流程 |

#### 生成的算子骨架

所有生成的算子均遵循统一结构：

```python
from dataflow.operators.base import BaseOperator
from dataflow.utils.storage import FileStorage

class DemoQualityFilter(BaseOperator):
    def __init__(self, threshold: float = 0.5):
        self.threshold = threshold

    def run(self, storage: FileStorage) -> FileStorage:
        # 在此实现过滤逻辑
        ...
        return storage

# 注册入口（由 Skill 自动生成）
OPERATOR_REGISTRY.register("DemoQualityFilter", DemoQualityFilter)
```

**核心规则：**
- 必须继承 `BaseOperator` 并实现 `run()` 方法
- `run()` 接受并返回 `FileStorage` 实例，保持链式传递
- 必须通过 `OPERATOR_REGISTRY` 完成注册，方可被 Pipeline 发现
- CLI 入口通过 `--input-file` / `--output-file` 参数直接调用 `run()`，与 Pipeline 上下文解耦
- `get_desc(lang)` 需支持中英双语（`zh` / `en`）

#### 常用命令行参数

| 参数 | 说明 | 可选值 |
|------|------|--------|
| `--dry-run` | 只展示文件计划，不写入任何文件 | — |
| `--overwrite` | 控制已有文件的覆盖行为 | `ask-each`（逐一确认）/ `overwrite-all`（全部覆盖）/ `skip-existing`（跳过已有） |
| `--validation-level` | 生成后的校验强度 | `none` / `basic` / `full` |
| `--log-dir` | 运行日志存储路径 | 自定义路径 |
| `--no-log` | 禁用运行日志 | — |

## 5. 模式对比与选择建议

| 对比维度 | 交互式采访（Mode A） | 直接 Spec（Mode B） |
|----------|---------------------|---------------------|
| 适合场景 | 首次使用、不确定参数 | 规格已明确、批量创建 |
| 启动方式 | `/dataflow-operator-builder` | `/dataflow-operator-builder --spec spec.json` |
| 上手难度 | 低，逐步引导 | 中，需了解 spec 格式 |
| 灵活性 | 高，每个字段可单独调整 | 高，可编程化、脚本化 |
| 效率 | 需要回答两轮问题 | 一次性提交，更快 |
| 可复现性 | 较低，依赖对话过程 | 高，spec 文件可版本管理 |

**选择建议：**
- 如果你是第一次使用，或者不确定该填什么参数 → 选 **Mode A**
- 如果你已经用过一次并保存了 spec，或需要批量生成多个算子 → 选 **Mode B**
- 团队协作场景下，建议将 spec 文件纳入版本管理，统一使用 **Mode B**

## 6. 注意事项与常见问题

### 6.1 关键注意事项

**注册必须完整**：生成的算子必须通过 `@OPERATOR_REGISTRY.register()` 装饰器完成注册，否则 Pipeline 无法发现该算子。如果注册测试失败，首先检查装饰器是否存在，以及模块是否被正确导入。

**`storage.step()` 不可省略**：在 CLI 或 Pipeline 中调用算子时，必须传入 `storage=storage.step()` 而非原始 `storage`。省略 `step()` 会导致算子读取空数据或输出文件不在预期路径。

**输入字段必须对齐**：`input_key` 必须是输入 dataframe 中已有的列名。如果运行时报 `KeyError`，检查 spec 中的 `input_key` 是否与实际数据列名匹配。

**覆盖策略需确认**：在已有代码的仓库中使用时，务必在 dry-run 阶段检查文件列表。推荐使用 `ask-each` 策略，逐一确认每个文件是覆盖还是跳过。

**校验级别建议 `full`**：`full` 级别会实际运行冒烟测试并检查输出产物，能在提交前发现大部分问题。仅在快速原型阶段才降级为 `none` 或 `basic`。

### 6.2 常见问题

**Q：生成后发现算子在 `OPERATOR_REGISTRY` 中找不到？**

A：通常是以下原因之一：(1) 缺少 `@OPERATOR_REGISTRY.register()` 装饰器；(2) 算子模块没有被导入（检查 `__init__.py` 中的 `TYPE_CHECKING` 块）；(3) 类名拼写不一致。运行注册测试（`test_<prefix>_registry.py`）可以快速定位。

**Q：冒烟测试通过但 CLI 运行失败？**

A：检查 CLI 入口脚本中是否正确调用了 `storage.step()`，以及 `--input-file` 指向的文件是否存在且格式正确（JSONL）。CLI 和算子逻辑应保持解耦——如果 CLI 中混入了算子内部逻辑，说明职责划分有问题。

**Q：对 LLM 响应的处理报错（空输出、格式异常）？**

A：如果算子使用了 LLM（`uses_llm: true`），需要在 `run()` 中对模型返回值做防御性处理。生成的骨架中包含辅助方法（如 `_generate_text`、`_score_with_llm`），应在这些方法中对 `None`、空字符串、非预期格式做兜底处理。

**Q：`--overwrite-all` 误覆盖了已有文件怎么办？**

A：Skill 会在写入前展示文件计划并要求确认。如果确实误覆盖了，建议通过 `git checkout` 恢复。预防措施：(1) 始终先执行 `--dry-run`；(2) 使用 `ask-each` 或 `skip-existing` 策略。
