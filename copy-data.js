import fs from "fs-extra"

// 复制 hanzi-writer-data 到 public 目录
fs.copySync("node_modules/hanzi-writer-data", "public/hanzi-writer-data")
