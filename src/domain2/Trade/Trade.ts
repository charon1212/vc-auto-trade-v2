import { Pair } from "../Exchange/type";
import { Execution } from "../Execution/Execution";

export type TradeStatus = 'requesting' // APIリクエストのレスポンス取得前。
  | 'requested' // APIリクエストが完了し、全部約定する前。
  | 'executed' // 全部約定済み。
  | 'cancel'; // APIリクエスト完了後に、全部約定する前にキャンセル。
export type TradeSide = 'buy' | 'sell';
export type TradeType = 'limit' | 'market';

export type Trade<T extends TradeType = TradeType> = {
  uid: string,
  strategyId: string,
  strategyBoxId: string,
  apiId: string,
  pair: Pair,
  status: TradeStatus,
  lastUpdateStatusMs: number, // ステータスの最終更新日（エポックミリ秒）
  tradeParam: TradeParam<T>,
  executions: Execution[],
};

export type TradeParam<T extends TradeType = TradeType> = TradeParamMarket<T> | TradeParamLimit<T>;

type TradeParamMarket<T extends TradeType> = T extends 'market' ? { type: 'market', side: TradeSide, amount: number, } : never;
type TradeParamLimit<T extends TradeType> = T extends 'limit' ? { type: 'limit', rate: number, side: TradeSide, amount: number, } : never;
