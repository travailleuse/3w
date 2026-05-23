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

推送前，先对照 `remote.ini` 检查各远程仓库 URL 是否匹配，确认无误后再执行。

```powershell
# 并行推送（推荐）
.\push.ps1

# 串行推送
.\push.cmd
```

## 约定

- 提交信息使用中文
- 提交命令使用 `git commit -s -m "消息"`（`-s` 添加 Signed-off-by），**禁止**附加 `Co-Authored-By` 尾注
- 仅 main 分支，无 develop/feature 分支
