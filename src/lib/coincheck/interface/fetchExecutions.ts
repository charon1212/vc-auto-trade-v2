import { v4 } from "uuid";
import { ea } from "../../../common/error/Vcat2Result";
import { DR } from "../../../common/typescript/deepreadonly";
import { Execution, Trade } from "../../../domain/BaseType";
import { CoincheckGetTransactions, ResponseBodyGetTransactions } from "../apiTool/CoincheckGetTransactions";

/**
 * 引数で指定した取引に関連する約定のうち、まだ取引の約定一覧に取り込んでいない約定の一覧を、取引所APIから取得する。
 *
 * @param requestedTrades 完全約定していない取引のリスト
 * @returns 約定のリスト。
 */
export const fetchUnregisteredExecutions = ea(__filename, async (requestedTrades: DR<Trade[]>) => {
  const result = await CoincheckGetTransactions.request({});
  return result.handleOk((transactions) => {
    const result = [] as Execution[];
    for (let transaction of transactions.transactions) {
      const transactionId = `${transaction.id}`;
      const orderId = `${transaction.order_id}`;
      const trade = requestedTrades.find(({ apiId }) => apiId === orderId);
      if (!trade) continue;
      if (trade.executions.some(({ apiId }) => apiId === transactionId)) continue;
      const { pair, amountVc, amountJp } = getAmountFromTransaction(transaction);
      const execution: Execution = {
        uid: v4(),
        apiId: transactionId,
        pair: pair,
        amount: Math.abs(+amountVc),
        amountJp: Math.abs(+amountJp),
        rate: +transaction.rate,
        createdAtMs: (new Date(transaction.created_at)).getTime(),
        tradeUid: trade.uid,
      };
      result.push(execution);
    }
    return result;
  });
});

const getAmountFromTransaction = (transaction: ResponseBodyGetTransactions['transactions'][number]) => {
  if (transaction.pair === 'btc_jpy') {
    return { pair: transaction.pair, amountVc: transaction.funds.btc, amountJp: transaction.funds.jpy };
  } else if (transaction.pair === 'eth_jpy') {
    return { pair: transaction.pair, amountVc: transaction.funds.eth, amountJp: transaction.funds.jpy };
  } else {
    const _: never = transaction; // チェック用コード。TODO: satisfiesが来たら代用したい。
    throw new Error('到達不能コード');
  }
};
