# Math 数学笔记

LaTeX 数学笔记，`xelatex` 编译。

## 注意事项

**公式定界符规范**：行内公式用 `\(...\)`，行间公式用 `\[...\]`，禁止使用 `$...$` 和 `$$...$$`。

**自定义命令**：`\dis`(displaystyle)、`\Zs`/`\Qs`/`\Rs`/`\Cs`(数集)、`\diff`(微分)、`\pa`(偏导)。

**行内公式显示样式**：需要 displaystyle 时加 `\dis`，如 `\(\dis \frac{a+b}{2}\)`。
**插图**：TikZ 绘制数学图形，置于 `figure[H]` 环境中。
**编译**：在 `Math/` 下执行 `xelatex -output-directory=build main.tex`。

## 公式定界符规范

行内公式用 `\(...\)`，行间公式用 `\[...\]`，禁止使用 `$...$` 和 `$$...$$`。

## 行内公式的显示样式

行内公式默认是压缩样式（textstyle）。若需要显示为行间样式（displaystyle），在公式开头加 `\dis`：

```latex
\(\dis \frac{a+b}{2}\ge\sqrt{ab}\)
```

`\dis` 定义在 `main.tex` 中：`\newcommand{\dis}{\displaystyle}`。

## 自定义命令（main.tex 中定义）

| 命令 | 含义 | 示例 |
|------|------|------|
| `\dis` | `\displaystyle` | `\(\dis \sum_{n=1}^{\infty} 1/n^2\)` |
| `\Zs` | `\mathbb{Z}` 整数集 | `\(n\in\Zs\)` |
| `\Qs` | `\mathbb{Q}` 有理数集 | |
| `\Rs` | `\mathbb{R}` 实数集 | |
| `\Cs` | `\mathbb{C}` 复数集 | |
| `\diff[var]` | `\mathrm{d}var` 微分算子 | `\diff[x]` 或默认 `\diff` |
| `\pa[var]` | `\partial{var}` 偏微分 | |

## 环境与结构

- 章节：`\section{}` / `\subsection{}` / `\subsubsection{}`
- 证明：`\begin{proof} ... \end{proof}`（amsthm 宏包）
- 公式对齐：`\begin{align*} ... \end{align*}`
- 列表：`\begin{itemize} \item ... \end{itemize}`

## 插图与 TikZ

数学图形使用 TikZ 绘制，在 `figure` 环境中：

```latex
\begin{figure}[H]
    \centering
    \begin{tikzpicture}
        % TikZ 绘图代码
    \end{tikzpicture}
    \caption{标题}
    \label{fig:label}
\end{figure}
```

`[H]` 选项（需 `float` 宏包）固定图片位置。图片编号格式为 `<章节>-<序号>`（如 `图 1-2`）。

## PDF 保留规则

`.gitignore` 中 `build/` 被全局忽略，但通过 `!Math/build/*.pdf` 保留了 PDF 文件。
不要随意删除 `Math/build/*.pdf`，它是已编译的可分发产物。
