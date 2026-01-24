# 介绍

## 文件目录机构

刚刚写这个项目，`indexedDB`是Web的数据库，我模仿`mangoDb`的写法实现了些许功能。

```shell
/dataStore
```
## 创建数据库

在`indexedDB`中，需要传入版本号，在这里，不需要了，我们封装了它，底层我们封装了它的变化。

创建数据库需要传入数据库名名称。

```javascript
const dbOpCtx = IndexedManger.createDbCtx("stu");# 创建操作上下文，因为indexedDB对象存储的添加，修改，删除，以及索引都必须在indexedDb进行。传入的参数是数据库的名字。
let storeOpCtx = dbOpCtx.createStore("user");# 类似的，storeOpCtx在build之后不能反悔了，必须升级数据库了。
storeOpCtx.addIdx("id", "op");
dbOpCtx.remoteStore("user");
dbOpCtx.addStore("score");
const db = dbOpCtx.build();# 实际创建数据库，在这之后，修改数据库涉及到了版本号升级了，在这之前，还有返回的机会。

```

