# vc-auto-trade-v2

仮想通貨自動取引(Virtual Currency Auto Trade)システムの第2バージョンです。よくvcat2と省略します。

## フォルダ構成

- batch: EC2(Linux)で使うためのバッチ。
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
