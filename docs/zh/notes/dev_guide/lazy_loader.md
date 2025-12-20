---
title: 必看-基于lazy_loader的算子开发
createTime: 2025/07/12 17:35:02
permalink: /zh/dev_guide/lazy_loader/
---
# 必看-基于lazy_loader的算子开发
因为Dataflow中有大量基于不同Python库，不同依赖的开发的算子。如果解释器一次性import所有算子和对应依赖，会带来极大的负载压力。而且随着未来各种库的增多，可能会有一些库是互斥的。所以`Lazyload`懒加载是必要的。懒加载，即仅在算子被导入（import）时，才加载其所需的全部依赖。

感谢[Zimo Meng](https://github.com/MOLYHECI)实现了自动识别语法树的lazyloader，并可以被VSCode正常高亮。开发新算子的时候，除了正常的写算子逻辑的python脚本，还需要注意写入必要的import以保证`Dataflow`框架能正常索引到对应的文件并import。

具体来说，参考这个最基础的`PromptedGenerator`算子：[链接](https://github.com/OpenDCAI/DataFlow/blob/main/dataflow/operators/generate/GeneralText/prompted_generator.py)

当实现了其逻辑后，需要在其上一级的`dataflow/operators/generate/__init__.py`文件中，添加在如下位置并做好对应注释：
```python
if TYPE_CHECKING:
    # GeneralText
    from .GeneralText.pretrain_generator import PretrainGenerator
    from .GeneralText.condor_generator import CondorGenerator
    from .GeneralText.prompted_generator import PromptedGenerator  # 像这样加在这里
    
    # Reasoning  
    ...
```

请务必按照上述格式，不要添加其他位置的`from xxxx import *`，以免失去`懒加载`的能力。 
