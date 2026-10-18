# 同声翻译认字模型（中英）

浮光掠影 App 的同声翻译第一次用时，从这里经 jsDelivr 下载（国内能连）。手机不用手动装。

- 模型：k2-fsa/sherpa-onnx 的 `sherpa-onnx-streaming-zipformer-small-bilingual-zh-en-2023-02-16`，只取 int8 的 encoder / decoder / joiner 和 tokens.txt（Apache-2.0）。
- jsDelivr 单个文件不能超过 20 MB，encoder 切成了 `part0`–`part2`，App 下载后按顺序拼回去，再核对 SHA-256：
  - encoder: db6f51551762e40e549166fe041ea3e45464370b595e9ad23f06478ec3794fbb
