# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概览

数学专业学生 王蕊 的个人学习仓库，三个主要方向：

1. **`dataStore/`** — IndexedDB 封装库（原型阶段），纯原生 JS，无构建工具
2. **`Math/`** — LaTeX 数学笔记，xelatex 编译
3. **`C/`** — C 语言实验/基准测试，CMake + C17 + pthread

详细参考文档在 [`ref-for-ai/`](ref-for-ai/) 和 [`AGENTS.md`](AGENTS.md)。

## 开发命令

### C 编译与运行
```powershell
cmake -B build -S C/
cmake --build build
.\build\Release\C.exe
```
编译器：MinGW-w64，clangd 路径 `D:\softwares\mingw64\bin\clangd.exe`

### LaTeX 编译
```powershell
cd Math
xelatex -output-directory=build main.tex
```

### JavaScript 调试
```powershell
python -m http.server
```
然后用浏览器打开 `http://localhost:8000`，`index.html` 加载 `dataStore/indexedDB.js`。

## Git 工作流

- **提交信息**：中文
- **分支**：仅 `main`，无 develop/feature 分支
- **远程仓库**：4 个（github、gitcode、gitee、gitlab），内容同步
- **推送**：`.\push.ps1`（并行）或 `.\push.cmd`（串行）

## Math 笔记约定

- 公式定界符：`\(...\)`（行内）、`\[...\]`（行间），**禁止使用 `$`**
- 自定义命令见 `main.tex`：`\dis`、`\Zs`/`\Qs`/`\Rs`/`\Cs`、`\diff`、`\pa`
- TikZ 绘图置于 `figure[H]` 环境中
- `Math/build/*.pdf` 保留在版本控制中（gitignore 特例）

## C 约定

- C17 标准，pthread 多线程
- 单可执行文件 `C`，入口 `main.c` → `testAll()` 协调所有测试
- `Vec.h` 基于 `void*` 的动态数组（指数增长策略 1.5x + 1）
- 生成 `test-*.txt` 临时文件，会被自动清理

## dataStore 状态

当前处于早期原型阶段：
- `indexedDB.js` 仅实现了 `getDB()`（自动版本递增）
- `IndexedManger` 类及 README 中描述的 API 均尚未实现
- 测试通过 `test/testIndexedDB.js` 手动在浏览器中运行
