#!/bin/sh

# batchディレクトリまで移動する
dir=$(dirname $0)
cd $dir

# プロジェクトのルートディレクトリに移動する
cd ../

# Gitアップデート
git pull

# npmインストール
npm install

echo "** complete git-update.sh **"
