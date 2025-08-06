---
title: logging
createTime: 2025/06/09 11:39:11
permalink: /en/dev_guide/logging/
---

## Logger

The logger for DataFlow is initialized in [dataflow/logger.py](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/logger.py). Developers can directly use the `get_logger()` function defined there to obtain a logger.

```python
from dataflow.logger import get_logger
logger = get_logger()
```

Usage is as follows. The debug, info, success, warning, and error methods correspond to different logging levels. By default, logs at the DEBUG level will not be displayed.
If you want to specify a filtering rule (for example, to display DEBUG and above logging information), set the DF_LOGGING_LEVEL environment variable in the command line:

```bash
export DF_LOGGING_LEVEL=DEBUG
```

Here is an example:
```python
def main():
    
    logger.debug("This is DEBUG message")
    logger.info("This is INFO message")
    logger.success("This is SUCCESS message")
    logger.warning("This is WARNING message")
    logger.error("This is ERROR message")
    
    return

main()
```

Principles for assigning log levels:

1. **DEBUG**: Outputs that are not very useful or should be hidden / technical details you don’t want to expose, such as:

    ```python
    for x in ['Text', 'image', 'video']:
        module_path = "dataflow.Eval." + x
        try:
            module_lib = importlib.import_module(module_path)
            clss = getattr(module_lib, name)
            self._obj_map[name] = clss
            return clss
        except AttributeError as e:
            logging.debug(f"{str(e)}")
            continue
        except Exception as e:
            raise e
    ```

	2.	**INFO**: Used to inform the user about the current runtime status, for example:

    ```python
    def pipeline_step(yaml_path, step_name):
        import yaml
        logger = get_logger()
        logger.info(f"Loading yaml {yaml_path} ......")
        with open(yaml_path, "r") as f:
            config = yaml.safe_load(f)
        config = merge_yaml(config)
        logger.info(f"Load yaml success, config: {config}")
        algorithm = get_operator(step_name, config)
        logger.info("Start running ...")
        algorithm.run()
    ```

	3.	**SUCCESS**: Information indicating that an important step has been completed.
	4.	**WARNING**: Messages indicating potential problems (currently no example).
	5.	**ERROR**: Printed when an error occurs during execution.

For logging inside operators, you can refer to [dataflow/operators/generate/Reasoning/question_generator.py](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/generate/Reasoning/question_generator.py).
