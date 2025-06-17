---
title: New Operator
createTime: 2025/06/12 12:00:00
permalink: /en/dev_guide/new_algo/
---

## New Algorithm

DataFlow operators are implemented in two forms:

1. Operators with a unified base class, located under `dataflow/Eval` or `dataflow/process`. These operators are required to implement specific methods defined by the base class, such as `__init__()`, `evaluate_batch()`, `filter_func()`, etc.

2. Operators without a unified base class, located in the `dataflow/generator/algorithm` directory. These operators must implement the `__init__` and `run()` methods.

To add a new operator to DataFlow, follow these steps after implementing the operator and its required methods:

1. Add a new file containing the operator class under the appropriate directory.

2. Import the `Registry` instance in that file and decorate the operator class using the `register()` method.

3. In the `__init__.py` file of the operator's directory, add the relative path to the operator file in the `_import_structure` variable.

If you need to add a new operator directory, you must also modify `dataflow/utils/registry.py` accordingly.
