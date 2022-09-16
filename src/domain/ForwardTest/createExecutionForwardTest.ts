import { DR } from "../../common/typescript/deepreadonly";
import { Execution } from "../Execution/Execution";
import { Trade } from "../Trade/Trade";
import * as uuid from 'uuid';

/**
 * ForwardTest用TradeのExecutionを作成する。
 * @param trade 対象の取引。
 * @param executedPrice 約定価格。成行注文の場合のみ必要。
 * @returns 作成したExecution。
 */
export const createExecutionForwardTest = (trade: DR<Trade>, executedPrice?: number): Execution => {
  if (!trade.isForwardTest) throw new Error('createExecutionForwardTestにisForwardTestがfalseのTradeが渡されました。');
  const { tradeParam } = trade;
  const rate = tradeParam.type === 'limit' ? tradeParam.rate : executedPrice;
  if (rate === undefined) throw new Error('成行注文でexecutedPriceが指定されていません。');
  const { uid, pair, tradeParam: { amount, }, } = trade;
  const execution: Execution = {
    uid: uuid.v4(),
    apiId: `forwardtest`,
    tradeUid: uid,
    pair,
    rate,
    amount,
    createdAtMs: Date.now(),
  };
  return execution;
};
