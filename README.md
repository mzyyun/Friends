# Friends Repository Bundle

这个目录用于集中放置“友情链接独立仓库”所需文件。

如果你只想把友链功能上传到 GitHub，请把 `friends/` 目录中的内容作为独立仓库根目录使用。

## 目录结构

- `friends/data/friends.json`
- `friends/CONTRIBUTING.md`
- `friends/scripts/validate-friends.mjs`
- `friends/.github/PULL_REQUEST_TEMPLATE/friend-link.md`
- `friends/.github/workflows/friends-validation.yml`

## 使用方法

1. 在 GitHub 新建仓库（例如 `mzyyun-friends`）
2. 把本目录下文件上传到仓库根目录（注意保留 `.github`、`data`、`scripts` 结构）
3. 提交后，PR 修改 `data/friends.json` 会自动触发校验
