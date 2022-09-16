import { Pair } from "../Exchange/type";
import { Execution } from "../Execution/Execution";

export type TradeStatus = 'requesting' // APIリクエストのレスポンス取得前。
  | 'requested' // APIリクエストが完了し、全部約定する前。
  | 'executed' // 全部約定済み。
  | 'cancel'; // APIリクエスト完了後に、全部約定する前にキャンセル。
export type TradeSide = 'buy' | 'sell';
export type TradeType = 'limit' | 'market';

/**
 * 取引
 */
export type Trade<T extends TradeType = TradeType> = {
  uid: string,
  strategyId: string,
  strategyBoxId: string,
  apiId: string,
  orderAtMs: number,
  pair: Pair,
  status: TradeStatus,
  lastUpdateStatusMs: number, // ステータスの最終更新日（エポックミリ秒）
  tradeParam: TradeParam<T>,
  executions: Execution[],
  isForwardTest: boolean,
};

export const tradeTypeGuard = <T extends TradeType>(trade: Trade, type: T): trade is Trade<T> => trade.tradeParam.type === type;

export type TradeParam<T extends TradeType = TradeType> = TradeParamMarket<T> | TradeParamLimit<T>;

type TradeParamMarket<T extends TradeType> = T extends 'market' ? { type: 'market', side: TradeSide, amount: number, } : never;
type TradeParamLimit<T extends TradeType> = T extends 'limit' ? { type: 'limit', rate: number, side: TradeSide, amount: number, } : never;
