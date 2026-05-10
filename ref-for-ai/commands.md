# 开发命令

## 本地服务器（JavaScript 调试）
```powershell
python -m http.server
```
然后用 Edge 打开 `http://localhost:8000`。

## LaTeX 编译
```powershell
xelatex -output-directory=build main.tex
```
在 `Math/` 目录下执行。需安装 TeX Live 或 MiKTeX，包依赖见 `main.tex` 的 `\usepackage`。

## C 编译与运行
```powershell
cmake -B build -S .
cmake --build build
.\build\Release\C.exe
```
需安装 MinGW-w64（已配置 clangd 调试）。标准为 C17。
生成的 `test-*.txt` 临时文件会被自动清理。

## C 语言 — 编译环境

C 代码使用 pthread，需要 MinGW-w64（已安装，clangd 路径 `D:\softwares\mingw64\bin\clangd.exe`）或 WSL。标准为 C17。

提交前执行 `lsp_diagnostics C/` 检查 LSP 错误。
