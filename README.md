# 浮光掠影 · 内容

浮光掠影 App 每次打开时，会从这里读取最新的掠影和留言。改完推送到 `main`，App 下次打开就能看到，不需要重新安装。

| 文件 | 内容 |
| --- | --- |
| `content/luoying.json` | 掠影：章节（`chapters`）和原始对话（`messages`） |
| `content/letters.json` | 留言：每封一条 `quote`（正文）和 `author`（署名，带「——」） |

## 加一封留言

在 `content/letters.json` 的 `letters` 末尾加一项：

```json
{
  "quote": "下次出门，说一声。",
  "author": "——姐姐"
}
```

## 加一篇掠影

在 `content/luoying.json` 的 `chapters` 里加一项。`id` 不能和已有的重复，`group` 用「写作方法」「场景练习」「连续故事」之一，`sourceIndex` 决定排序。正文里用空行分段，以【开头的段落会显示成时间地点条。

```json
{
  "id": "claude-145",
  "sourceIndex": 145,
  "title": "章节标题",
  "group": "连续故事",
  "text": "第一段\n\n第二段",
  "characters": 6
}
```

## 推送之后

推送后会自动检查 JSON 格式，并刷新 CDN 缓存（见「Actions」页）。格式有错时这一步会失败，App 也会继续用手机里上一份能用的内容，不会变空。

App 读取的地址：

- `https://cdn.jsdelivr.net/gh/dhhd1426-ops/fuguanglueying@main/content/luoying.json`
- `https://cdn.jsdelivr.net/gh/dhhd1426-ops/fuguanglueying@main/content/letters.json`

注意：这个仓库是公开的，里面的内容任何人都能看到。
