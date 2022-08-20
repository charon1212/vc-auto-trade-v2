import { v4 } from 'uuid';
import { getExchangeOrdersTransactions } from '../../interfaces/coincheck/getExchangeOrdersTransactions';
import { fetchExecutions } from '../../lib/coincheck/interface/fetchExecutions';
import { findExecutionByApiIdList } from '../../lib/typeorm/repository/Execution/findExecution';
import { insertExecution } from '../../lib/typeorm/repository/Execution/insertExecution';
import { getTradeIdMap } from '../../lib/typeorm/repository/Trade/getTradeIdMap';
import { tradeManager } from '../Trade/TradeManager';

const updateSpanMs = 3000; // 3秒
class ExecutionMonitorClass {
  // 最終更新日時
  lastUpdateMs: number = 0;
  constructor() { };

  async update() {
    if (Date.now() - this.lastUpdateMs < updateSpanMs) return; // 前回実行からの経過時間がアップデートスパンより短い場合は更新しない。

    const requestedTradeList = tradeManager.getCache('requested');
    const executions = await fetchExecutions(requestedTradeList);
    const transactions = await getExchangeOrdersTransactions();
    if (!transactions) {
      // TODO: エラー処理
      return;
    }
    const existingEntities = await findExecutionByApiIdList(transactions.transactions.map(({ id }) => `${id}`));
    const existingId = existingEntities.map(({ apiId }) => apiId);
    const saveTransactions = transactions.transactions.filter(({ id }) => !existingId.includes(`${id}`));
    const idMap = await getTradeIdMap(saveTransactions.map(({ order_id }) => `${order_id}`)); // TODO: typeormではなくTradeManager側を利用する。
    for (let transaction of saveTransactions) {
      const { id, order_id, created_at, rate, funds: { btc }, pair } = transaction;
      const tradeUid = idMap.find(({ apiId }) => `${order_id}` === apiId)?.uid;
      if (tradeUid !== undefined) {
        await insertExecution({
          uid: v4(),
          apiId: `${id}`,
          pair,
          createdAtMs: (new Date(created_at)).getTime(),
          rate: +rate,
          amount: +btc,
          tradeUid,
        });
      }
    }
    this.lastUpdateMs = Date.now();
  }
}

export const ExecutionMonitor = new ExecutionMonitorClass();
