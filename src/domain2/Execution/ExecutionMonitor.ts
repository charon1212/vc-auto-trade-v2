import { fetchUnregisteredExecutions } from '../../lib/coincheck/interface/fetchExecutions';
import { insertExecution } from '../../lib/typeorm/repository/Execution/insertExecution';
import { tradeManager } from '../Trade/TradeManager';

const updateSpanSecond = 1;
const updateSpanMs = updateSpanSecond * 1000;

class ExecutionMonitorClass {
  // 最終更新日時
  lastUpdateMs: number = 0;
  constructor() { };

  async update() {
    if (Date.now() - this.lastUpdateMs < updateSpanMs) return; // 前回実行からの経過時間がアップデートスパンより短い場合は更新しない。
    this.lastUpdateMs = Date.now();
    const requestedTradeList = tradeManager.getCache('requested');
    const executions = await fetchUnregisteredExecutions(requestedTradeList);
    for (let execution of executions) {
      await insertExecution(execution);
      tradeManager.setExecution(execution);
    }
  }
}

export const ExecutionMonitor = new ExecutionMonitorClass();
