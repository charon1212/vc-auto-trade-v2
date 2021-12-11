#!/bin/sh

###############################################################
# USAGE
# - インストールするマシンに入る、（パスワード無しでsudoできること。）
# - SCP等を使い、Linux環境に持っていく。
# - "$ chmod 744 git-clone.sh"で権限変更。
# - "$ ./git-clone.sh"で実行する。
# - 初回の場合は、質問にyと答えて、Gitクライアントをyumでインストールする。
###############################################################

echo "git install? (y/n)"
read ANS

if [ "$ANS" -eq "y" ]
then
    sudo yum update
    sudo yum install git
fi

git clone "https://github.com/charon1212/vc-auto-trade-v2.git"
