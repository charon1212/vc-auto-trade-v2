# vc-auto-trade-v2

仮想通貨自動取引(Virtual Currency Auto Trade)システムの第2バージョンです。よくvcat2と省略します。

## フォルダ構成

- batch: EC2(Linux)で使うためのバッチ。
- dist: git管理対象外。トランスパイルしたjsファイルの置き場所。
- docs: マニュアルとか、将来の構想のイメージ図を置く場所。
- files: プログラムから利用する、ファイル置き場。バッチの実行状況を記録しておき、再起動時にそれを読み込んでスタートする。
- logs: git管理対象外。ログ出力用。
- node_modules: git管理対象外。nodeのモジュール管理用。`npm install`で自動的に作られる。
- projects/vcat2-analyze-tool: VCAT2の実行結果を可視化するためのWEBアプリケーション。firebaseでホスティングする前提で作られてる。
- src: vcat2のソースファイル本体。
  - common: ログ出力/環境変数などの、プロジェクト全体を通しての共通処理。
  - domain: ドメインロジック。
  - express: RDBのRead操作用にWebサーバーを立てたかったので、Webサーバーの実装。
  - interfaces: WebAPIを使って外部と通信する部分。typeormをここに入れてもよかったけど、別だし。
  - tradingLogic: ボリンジャーとか、MACDとか、基本的なトレーディングのロジック。
  - type: 型定義。あんまり使ってない。。。
  - typeorm: TypeORMまわりの実装。DB定義に対応するEntity定義まではここに記述する。
  - index.ts: メイン処理のエントリーポイント。
  - debug.ts: デバッグ用のエントリーポイント。

## npm-scripts

- `npm run start`
  - command: `tsc && node dist/index.js`
  - メインサーバーを起動する。サーバーが起動すると初期化処理が走り、トレードが開始する。
- `npm run debug`
  - command: `tsc && node dist/debug.js`
  - サーバーをデバッグ実行する。デバッグ実行の内容は、[debug.ts](/src/debug.ts)に記載する。
- `npm run start-server`
  - command: `tsc && node dist/express/index.js`
  - フロント用のWebサーバーを起動する。
- `npm run build`
  - command: `tsc`
  - ビルドだけ実行する。

## リリース手順メモ

毎年やる、AWSアカウント作り替え用。2022年度でやった手順を残す。

- AWSアカウント作成＆セキュリティ設定等実施。
- EC2とRDSを立ち上げる。
- RDSのセキュリティグループ設定に、EC2からのmysqlアクセスを許可。
- EC2で、以下の実施。
  - [git-clone.sh](./batch/git-clone.sh)を参考に、gitをyumで入れて、cloneする。
  - nodeをインストールする。
    - 基本は、AWS公式の<https://docs.aws.amazon.com/ja_jp/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html>に従う。
    - node v18をインストールしたら、エラーで使えなかったので、バージョンに注意する。
  - 何かと使うので、mysqlをインストールする。(`sudo yum install mysql`)
  - envファイルを更新する。
