import { v4 } from "uuid";
import { DR } from "../../../common/typescript/deepreadonly";
import { Execution } from "../../../domain2/Execution/Execution";
import { Trade } from "../../../domain2/Trade/Trade";
import { Pair } from "../../../type/coincheck";
import { CoincheckGetTransactions } from "../apiTool/CoincheckGetTransactions";

export const fetchExecutions = async (requestedTrades: DR<Trade[]>) => {
  const transactions = await CoincheckGetTransactions.request({});
  if (!transactions) {
    throw new Error(''); // TODO:エラー処理
  }
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
      amount: +transaction.funds.btc, // TODO: 'btc_jpy'前提の書き方
      rate: +transaction.rate,
      createdAtMs: (new Date(transaction.created_at)).getTime(),
      tradeUid: trade.uid,
    };
    result.push(execution);
  }
  return result;
};
