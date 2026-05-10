# 项目结构

数学专业学生 王蕊 的个人学习仓库。三个主要方向：IndexedDB 封装库、数学笔记 (LaTeX)、C 语言实验。

```
/
├── dataStore/          # 主项目：IndexedDB 封装库（模仿 MongoDB API，早期阶段）
│   ├── indexedDB.js    # 原型实现：自动版本管理 + 获取数据库连接
│   └── cacheUtils.js   # Cache API 示例
├── test/
│   └── testIndexedDB.js
├── index.html          # 加载 dataStore/indexedDB.js 的入口
├── die.html            # 纯前端：3D 骰子（CSS 3D 变换 + JS 拖拽旋转）
├── Math/               # LaTeX 数学笔记（xelatex 编译）
│   ├── main.tex        # 入口，\input 三个章节
│   ├── algebra.tex     # 代数：十进制运算/基本不等式/群论/复数
│   ├── geometry.tex    # 几何：三角函数差角公式的几何证明
│   ├── analysis.tex    # 分析学：空壳，仅一个积分号
│   └── build/main.pdf  # 已编译的 PDF
├── C/                  # C 语言实验（CMake + C17）
│   ├── CMakeLists.txt  # 编译目标：C（可执行文件）
│   ├── main.c          # 入口，调用 testAll()
│   ├── include/
│   │   ├── Vec.h       # 动态数组（void* 存储）
│   │   ├── testPreSum.h# 前缀和性能对比（单线程 vs pthread）
│   │   └── testCreateFile.h # 文件 I/O 性能测试（pthread）
│   └── src/
│       ├── Vec.c
│       ├── testPreSum.c
│       └── testCreateFile.c
├── docs/
│   ├── indexdDB.md     # IndexedDB 使用笔记
│   ├── 有用的网站.md    # 编程语言参考链接
│   └── opencode-install.md  # Node.js + OpenCode 安装教程
├── push.cmd            # 顺序推送到 3 个远程仓库
├── push.ps1            # 并行推送到 3 个远程仓库
├── AGENTS.md           # 本文件索引
└── ref-for-ai/         # AI 参考文档（本目录）
```

## 模块职责

| 目录 | 技术栈 | 成熟度 | 入口文件 |
|------|--------|--------|----------|
| `dataStore/` | 原生 JavaScript, IndexedDB | 原型阶段 | `indexedDB.js` |
| `Math/` | LaTeX, TikZ | 进行中（analysis.tex 空壳） | `main.tex` |
| `C/` | C17, CMake, pthread | 实验性 | `main.c` → `testAll()` |
| `die.html` | CSS 3D, 原生 JS | 完成态 | 独立页面 |

## dataStore 说明

当前 `dataStore/indexedDB.js` 只是原型：

- `IndexedManger` 类尚未实现
- `getDB()` 是简单的自动版本号递增
- README 中描述的 API（`createDbCtx` / `createStore` / `build`）尚未开发
