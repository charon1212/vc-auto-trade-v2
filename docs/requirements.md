# 要件定義

vcat2の要件定義を改めて行いたい。

## 用語

- Strategy: 1つの投資戦略を表す。例えば、「macdシグナルを追跡し、一定の閾値を超えたときに売買を行う」といったような、購買のルールを表現した1単位。
  - StrategyParam: 上記の例の"閾値"で示したように、Strategyにはルールの途中で利用するパラメータがある。それを表現したもの。
  - StrategyContext: 上記の戦略が購買ルールを判断するために持っているコンテキスト情報。以前にどんな決断をしてここに至っているかを記憶する。
- ForwardTest: あるStrategyについて仮想的に取引を行い、もし実際に取引を行っていたらどの程度収支が見込めるかをテストする。
- BackTest: 過去の価格情報をもとに、あるStrategyが価値のあるものか判断するために実施するテストのこと。
- StrategyBox: 1つのStrategyを、1つのStrategyParamに従って運用を行う設計上の概念。
- Exchange: 取引所のこと。今はCoincheckを利用中。
- Pair: 通貨ペアのことを指す。例えば、btc - jpy等。どちらかが取引対象通貨（btc - jpyの場合は、btcが取引対象通貨）となり、逆を流通通貨（btc - jpyの場合は、jpyが流通通貨）となる。
- Trade: 取引のこと。注文して、約定するか完了するまでのライフサイクルを持つ。
  - TradeSide: 売り/買いのこと。
  - TradeType: 指値買いや成行買い等の注文方法を指す。
  - Amount: 注文数量。取引対象通貨側の単位で記す。
  - Rate: 取引レート。1取引対象通貨を、何流通通貨で取引するかを表現する。
- Execution: 約定のこと。発注した注文に従って、実際に行われた取引のこと。
