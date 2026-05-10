# Git 工作流

## 远程仓库

三个远程，内容保持同步：

| 远程名 | 托管平台 | 地址 |
|--------|----------|------|
| `github` | GitHub | `git@github.com:travailleuse/3w.git` |
| `gitcode` | GitCode | `git@github.com:travailleuse/3w.git` |
| `gitee` | Gitee | `git@gitee.com:travailleuse/3w.git` |

注意：`gitcode` 和 `github` 指向同一个仓库地址。

## 推送

```powershell
# 并行推送（推荐）
.\push.ps1

# 串行推送
.\push.cmd
```

## 约定

- 提交信息使用中文
- 仅 main 分支，无 develop/feature 分支
