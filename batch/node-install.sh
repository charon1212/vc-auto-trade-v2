#!/bin/sh

###########################################################################
# CAUTION
# Check Nvm Download Url.
# see: https://docs.aws.amazon.com/ja_jp/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html
###########################################################################

# AWS公式が書いてるリンクより、nvmのgitリポジトリに最新があるので、こちらを利用。
# curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# nvm有効化
. ~/.nvm/nvm.sh

# node18を入れると、下記のエラーでインストールできなかった。いったん、バージョン指定で回避する。
### > node: /lib64/libm.so.6: version `GLIBC_2.27' not found (required by node)
### > node: /lib64/libc.so.6: version `GLIBC_2.28' not found (required by node)
# https://hellomyworld.net/posts/node-glibc-not-found-after-install/
nvm install v17.2.0 
