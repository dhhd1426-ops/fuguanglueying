# 浮光掠影插件

给助理多几样手边的东西。一个插件就是一个 GitHub 仓库（或仓库里的一个目录），两个文件：

## plugin.json

```json
{
  "id": "weather",                 // 小写字母、数字、- _，最多 32 位
  "name": "天气",
  "version": "1.0.0",
  "author": "你的名字",
  "description": "一两句话说明它能做什么",
  "category": "生活",              // 生活 / 工具 / 内容 / 学习 / 其他
  "permissions": [
    { "kind": "net", "hosts": ["api.example.com"] },   // 只能访问列出的域名（含子域）
    { "kind": "storage" }                              // 插件自己的一小块本地存储
  ],
  "tools": [
    {
      "name": "get_weather",       // 字母数字下划线
      "description": "给模型看的说明：什么时候用、参数是什么",
      "note": "正在查天气…",       // 她用这个工具时输入框上方显示的话（可选）
      "parameters": { "type": "object", "properties": { "city": { "type": "string" } }, "required": ["city"] }
    }
  ],
  "system": "装上后加进她提示词的一句话（可选）"
}
```

## index.js

```js
tools.get_weather = function (args) {
  var r = JSON.parse(host.fetch('https://api.example.com/...', '{}'));
  if (r.error) throw new Error(r.error);
  return { temp: 21 };     // 返回能转成 JSON 的东西，模型会看到
};
```

跑在 QuickJS 里（ES2020，没有 fetch / setTimeout / require）。宿主只给这几样：

| 调用 | 作用 |
|---|---|
| `host.fetch(url, optionsJson)` | 发请求，只能 https，只能访问申请过的域名。`options` 是 JSON 字符串：`{"method":"POST","headers":{},"body":""}`。返回 JSON 字符串 `{"status":200,"body":"..."}` 或 `{"error":"..."}` |
| `host.get(key)` / `host.set(key, value)` | 插件自己的本地存储（要申请 storage 权限），只收发字符串 |
| `host.log(text)` / `console.log(...)` | 写到 logcat |

工具名在模型那边会带插件 id 前缀（`weather__get_weather`），不会和别的撞。

## 收录到市场

把仓库地址发给我们，或者直接在 App 市场的搜索框里粘贴仓库地址安装。市场索引是本目录的 `index.json`。
