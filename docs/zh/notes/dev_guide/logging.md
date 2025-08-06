---
title: 日志
createTime: 2025/06/09 11:42:43
permalink: /zh/dev_guide/logging/
---

## Logger

DataFlow的日志管理器初始化在在[dataflow/logger.py](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/logger.py)中。开发者可直接使用其中定义的`get_logger()`函数获取logger.
```python
from dataflow.logger import get_logger
logger = get_logger()
```
使用方法如下所示，其中debug, info, success, warning, error代表不同的日志等级，默认情况下DEBUG等级的日志不会显示。
如果想要指定屏蔽规则（如显示DEBUG及以上的logging信息）请在命令行指定`DF_LOGGING_LEVEL`环境变量：
```bash
export DF_LOGGING_LEVEL=DEBUG
```
下面是一个例子：
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
关于等级的分配原则：
1. DEBUG：一些没什么用需要屏蔽的输出 / 不想展示的技术细节，如：
```python
                for x in ['Text', 'image', 'video']:
                    module_path = "dataflow.Eval." + x
                    try:
                        module_lib = importlib.import_module(module_path)
                        clss = getattr(module_lib, name)
                        self._obj_map[name] = clss
                        return clss
                    except AttributeError as e:
                        logger.debug(f"{str(e)}")
                        continue
                    except Exception as e:
                        raise e
```
2. INFO: 让用户得知目前的运行情况，如：
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
3. SUCCESS: 重要步骤完成的信息。
4. WARNING：可能出现问题的错误信息（暂时没有例子）
5. ERROR：运行出现错误，打印错误信息

算子内部的logging可以参考[dataflow/operators/generate/Reasoning/question_generator.py](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/generate/Reasoning/question_generator.py)。