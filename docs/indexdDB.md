# `indexedDB`的使用

`indexedDB`本质上是一个`IDBFactory`对象。

## 打开一个数据库

下面返回的是一个`IDBOpenDBRequest`，表示一个获取打开数据库的请求。因为有可能打开失败。

```javascript
const req = indexedDB.open("test");
console.log(req.constructor.name); // IDBOpenDBRequest
console.log(indexedDB.constructor.name) // IDBFactory
```

`req`有一些事件。

|     事件      | 名称            | 触发时机            |
| :-----------: | --------------- | ------------------- |
|    success    | onsuccess       | 数据库打开/创建后   |
| upgradeneeded | onupgradeneeded | 数据库版本升级/创建 |

如下代码创建/获得一个数据库

```javascript
const getDB = (name, version) => {
    const req = indexedDB.open("test", version);
    console.log(req.constructor.name);
    return new Promise((resolve, reject) => {
        req.onsuccess = (e) => {
            console.log("onsuccess");
            resolve(e.target.result);
        };

        req.onupgradeneeded = (e) => {
            console.log("onupgradeneeded");
        };
        req.onerror = (e) => reject(e.target.error);
    });
}
// 如果数据库test不存在，输出 onupgradeneeded onsuccess
// 如果数据库存在，且版本一致，输出onsuccess。
// 其他情况输出onupgradeneeded onsuccess
```

