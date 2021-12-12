#!/bin/sh

# batchディレクトリまで移動する
dir=$(dirname $0)
cd $dir

# プロジェクトのルートディレクトリに移動する
cd ../

# コンパイル
tsc

# サービススタート
forever start ./dist/index.js
