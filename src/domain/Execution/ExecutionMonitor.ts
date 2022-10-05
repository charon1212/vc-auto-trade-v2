import { okVoid } from '../../common/error/Result';
import { Vcat2Result } from '../../common/error/Vcat2Result';
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
  async update(): Promise<Vcat2Result<void>> {
    if (Date.now() - this.lastUpdateMs < updateSpanMs) return okVoid(); // 前回実行からの経過時間がアップデートスパンより短い場合は更新しない。
    this.lastUpdateMs = Date.now();
    const requestedTradeList = tradeManager.getCache('requested');

    const result = await fetchUnregisteredExecutions(requestedTradeList);
    return result.handleOk(async (executions) => {
      for (let execution of executions) {
        await insertExecution(execution);
        tradeManager.setExecution(execution);
      }
    }).await();
  }
}

export const executionMonitor = new ExecutionMonitor();
