import { fetchUnregisteredExecutions } from '../../lib/coincheck/interface/fetchExecutions';
import { insertExecution } from '../../lib/typeorm/repository/Execution/insertExecution';
import { tradeManager } from '../Trade/TradeManager';

const updateSpanSecond = 1;
const updateSpanMs = updateSpanSecond * 1000;

class ExecutionMonitor {
  // 最終更新日時
  private lastUpdateMs: number = 0;
  constructor() { };

  // TODO: できれば単一Nodeで実行したい。
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

export const executionMonitor = new ExecutionMonitor();
