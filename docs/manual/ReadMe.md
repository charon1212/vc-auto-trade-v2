# VCAT2マニュアル

vcat-2の使い方の簡易マニュアル。AWSで動かすことを想定して作っているが、別にオンプレでも行ける気がする。

## 初期設定

- APサーバーを立ち上げる。EC2なら、パブリックにしておくこと。
- DBサーバーを立ち上げる。MySQLを想定している。他のにするなら、AP改修が必要。
- APサーバーに入り、/batch/git-clone.shを持っていって実行する。
- /batch/node-install.shを実行し、nodejsをインストールする。
  - なぜかバッチ経由だと失敗することがあるので、<https://docs.aws.amazon.com/ja_jp/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html>を参考に手動で補正する。
- /batch/forever-install.shを実行し、foreverをglobalインストールする。

## サービススタート

- /batch/git-update.shを実行して、gitの最新にアップデートする。
- /batch/service-start.shを実行すると、VCAT2本体が起動する。
- /batch/service-debug.shを実行すると、debug.tsで書いたデバッグコードが動く。
- /batch/service-seb-server.shを実行すると、vcat2-analyze-tool用のREST APIが立ち上がる。
- サービスは、手動で停止する。「forever list」で動いているプロセスが見えるので、idを覚えて「forever stop *id*」を実行する。
