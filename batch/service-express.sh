#!/bin/sh

# batchディレクトリまで移動する
dir=$(dirname $0)
cd $dir

# プロジェクトのルートディレクトリに移動する
cd ../

# コンパイル
npm run build

# サービススタート
forever start ./dist/lib/express/index.js
