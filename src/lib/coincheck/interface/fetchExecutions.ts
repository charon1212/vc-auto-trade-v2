import { v4 } from "uuid";
import { DR } from "../../../common/typescript/deepreadonly";
import { Pair } from "../../../domain/Exchange/type";
import { Execution } from "../../../domain/Execution/Execution";
import { Trade } from "../../../domain/Trade/Trade";
import { CoincheckGetTransactions } from "../apiTool/CoincheckGetTransactions";

/**
 * 引数で指定した取引に関連する約定のうち、まだ取引の約定一覧に取り込んでいない約定の一覧を、取引所APIから取得する。
 *
 * @param requestedTrades 完全約定していない取引のリスト
 * @returns 約定のリスト。
 */
export const fetchUnregisteredExecutions = async (requestedTrades: DR<Trade[]>) => {
  const result = await CoincheckGetTransactions.request({});
  return result.handleOk((transactions) => {
    const result = [] as Execution[];
    for (let transaction of transactions.transactions) {
      const transactionId = `${transaction.id}`;
      const orderId = `${transaction.order_id}`;
      const trade = requestedTrades.find(({ apiId }) => apiId === orderId);
      if (!trade) continue;
      if (trade.executions.some(({ apiId }) => apiId === transactionId)) continue;
      const execution: Execution = {
        uid: v4(),
        apiId: transactionId,
        pair: transaction.pair as Pair,
        amount: Math.abs(+transaction.funds.btc), // TODO: 'btc_jpy'前提の書き方
        rate: +transaction.rate,
        createdAtMs: (new Date(transaction.created_at)).getTime(),
        tradeUid: trade.uid,
      };
      result.push(execution);
    }
    return result;
  });
};
