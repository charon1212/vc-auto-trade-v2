/** 通貨ペア */
export type Pair = 'btc_jpy';

/** 通貨 */
export type Currency = 'jpy' | 'btc' | 'eth' | 'etc' | 'lsk' | 'xrp' | 'xem' | 'ltc' | 'bch' | 'mona' | 'xlm' | 'qtum' | 'bat' | 'iost' | 'enj' | 'omg' | 'plt' | 'sand' | 'xym' | 'dot';

/** 約定 */
export type Execution = {
  uid: string,
  apiId: string,
  tradeUid: string,
  pair: Pair,
  rate: number,
  amount: number,
  amountJp: number,
  createdAtMs: number
};

/** 市場情報 */
export type Market = {
  timestamp: number,
  price: number,
};

/** 短期市場履歴 */
export type ShortHistory = {
  pair: Pair,
  priceHistory: number[],
  spanMs: number,
};

/** 取引 */
export type Trade<T extends TradeType = TradeType> = {
  uid: string,
  strategyId: string,
  strategyBoxId: string,
  apiId: string,
  orderAtMs: number,
  pair: Pair,
  status: TradeStatus,
  lastUpdateStatusMs: number,
  tradeParam: TradeParam<T>,
  tradeRequestParam: TradeRequestParam,
  executions: Execution[],
  isForwardTest: boolean,
};

export type TradeStatus =
  | 'requesting' // APIリクエストのレスポンス取得前。
  | 'requested' // APIリクエストが完了し、全部約定する前。
  | 'executed' // 全部約定済み。
  | 'cancel'; // APIリクエスト完了後に、全部約定する前にキャンセル。
export type TradeSide = 'buy' | 'sell';
export type TradeType = 'limit' | 'market';

export type TradeParam<T extends TradeType = TradeType> = TradeParamMarket<T> | TradeParamLimit<T>;
type TradeParamMarket<T extends TradeType> = T extends 'market' ? { type: 'market', side: TradeSide, amount: number, stopLossRate?: number, } : never;
type TradeParamLimit<T extends TradeType> = T extends 'limit' ? { type: 'limit', rate: number, side: TradeSide, amount: number, stopLossRate?: number, } : never;

type TradeRequestParam = {
  amount?: number,
  amountBuyMarket?: number,
};

export type ReportDefinition<Report> = {
  createSpanMs: number,
  marketHistorySpanMs: number,
  creator: (marketHistory: Market[]) => Report,
};
