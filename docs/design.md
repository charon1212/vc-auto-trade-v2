# design

requirementsに要件書いて、それを元にざっくりしたAP設計をしたい。

## クラス設計

### Strategy

Strategyは、抽象化した戦略。StrategyParamを与えることで、具体的な取引ルールとなる。抽象化した各戦略は、StrategyFunctionで特徴づけられる。
以下の4要素で構成される。

- StrategyFunction…戦略を表現した関数。
- StrategyId…識別子。
- StrategyParam…パラメータを表現するデータ型。
- StrategyContext…コンテキストを表すデータ型。

### StrategyBox

StrategyBoxは、決められた1つのStrategyを元に運用するオブジェクトである。

- 定期実行関数tickを持つ。定期実行自体は、StrategyBoxContainerが担う。tick内の処理は以下のとおり。
  - StrategyFunctionの入力（市場情報(Market)と取引情報(Trade)）を取得する。
  - StrategyFunctionを実行する。
  - StrategyFunctionの戻り値から、発注/キャンセルを行う。
- 次の設定値を持つ。
  - strategyBoxId
  - strategyId
  - strategyParam
  - lastTick: 死活監視用。10秒間隔で実行するはずなのに、1分間応答がないとかを判定してもらう。
- 運用状態を持つ。運用状態は、以下のとおり。
  - running: 起動中の状態。
  - error: エラー発生により、tickを停止している状態。
  - sleep: 停止中の状態。コンテキストなどは維持するため、オブジェクト自体は破棄されない。
- Strategyが出した決断をもとに、TradeManagerに発注を依頼するのもこの関数の仕事。

### StrategyBoxContainer

StrategyBoxを管理するオブジェクト。

- StrategyBoxの初期化処理を実行する。
- どういったStrategyやパラメータでStrategyBoxを運用するかは、DB管理する。
- DBの変更を検知して、運用中のStrategyBoxに反映する。（パラメータの変更や、起動/停止など。）
- StrategyBoxの死活監視を行う。
  - 1分ごとに見回って、5分以上lastTickが動いてないやつがいたらエラー扱いにして警告する。
  - 1日ごとに見回って、エラーの奴がいたら警告する。

### MarketInfoCache

定期的に市場情報（価格など）を取得し、永続保存する。
また、永続保存の際にオンメモリにもキャッシュし、提供する外部APIを用意する。

- StrategyBoxは、StrategyとStrategyParamを受け取り、正運用とフォワードテストを実行する。
- MarketInfoは、主に過去の価格情報等の、現在取得できる市場情報を指す。StrategyFunctionのインプットになる。
- StrategyUtilは、Strategyを構築する上でのutil関数を登録する。2つの側面がある。
  - StrategyMetricsは、MACDやEMAのように、抽象化した投資指標を表す。
  - MarketInfoAnalyzerは、vcat2におけるMarketInfoを解釈するための補助的な役割を果たす。
- StrategyBoxは、StrategyBoxContainerにより管理される。
- StrategyBoxは、外部コマンドを通じて以下の操作が行われる。これらの操作は、StrategyBoxContainerが管理する。
  - パラメータ変更
  - 追加/削除

### TradeManager

取引所APIから情報を取得し、自分の出した取引情報(Trade)がどうなっているかを管理する。

- オーダーされたTradeを元に、APIを実行する。
- 各StrategyBoxのTrade一覧を取得するAPIを提供する。

- I/F

### TradeCache

DB管理しているTradeを、自前でキャッシュしておく。

### ExecutionMonitor

定期的に約定一覧を取得し、DBに反映する。Tradeの状態変更（requested -> executedの判定）もここが担当する。

## DB設計

- PriceHistory
- Trade
- Execution
- StrategyBox
