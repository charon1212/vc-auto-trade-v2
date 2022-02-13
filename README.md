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
  - typeorm: TypeORMまわりの実装。
  - index.ts: メイン処理のエントリーポイント
  - debug.ts: デバッグ用のエントリーポイント
