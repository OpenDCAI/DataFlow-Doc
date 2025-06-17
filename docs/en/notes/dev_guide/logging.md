---
title: logging
createTime: 2025/06/09 11:39:11
permalink: /en/dev_guide/logging/
---

## Logger

Currently, the logger is initialized in `pipeline_step.py`:

```python
import logging
logging.basicConfig(level=logging.INFO,
    format="%(asctime)s | %(filename)-20s- %(module)-20s- %(funcName)-20s- %(lineno)5d - %(name)-10s | %(levelname)8s | Processno %(process)5d - Threadno %(thread)-15d : %(message)s", 
    datefmt="%Y-%m-%d %H:%M:%S"
    )
```

Usage is as follows. `debug`, `info`, `warning`, and `error` represent different log levels. By default, logs at the DEBUG level are not shown.

```python
def main():

    logging.debug("This is DEBUG message")
    logging.info("This is INFO message")
    logging.warning("This is WARNING message")
    logging.error("This is ERROR message")

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

2. **INFO**: Used to let users know the current execution status, such as:

    ```python
    def pipeline_step(yaml_path, step_name, step_type):
        import logging
        import yaml
        logging.info(f"Loading yaml {yaml_path} ......")
        with open(yaml_path, "r") as f:
            config = yaml.safe_load(f)
        config = merge_yaml(config)
        logging.info(f"Load yaml success, config: {config}")
        if step_type == "process":
            algorithm = get_processor(step_name, config)
        elif step_type == "generator":
            algorithm = get_generator(step_name, config)
        logging.info("Start running ...")
        algorithm.run()
    ```

3. **WARNING**: Error messages indicating potential issues (no examples for now).

4. **ERROR**: Errors that occur during execution; used to print error messages.

For logging inside operators, refer to `DataFlow/dataflow/generator/algorithms/TreeSitterParser.py`.
