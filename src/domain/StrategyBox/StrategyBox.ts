import { StrategyLogger } from '../../common/log/StrategyLogger';
import { updateStrategyBox } from '../../lib/typeorm/repository/StrategyBox/updateStrategyBox';
import { Pair } from "../BaseType";
import { executionMonitor } from '../Execution/ExecutionMonitor';
import { tradeManagerForwardTest } from '../ForwardTest/TradeManagerForwardTest';
import { marketCache } from '../Market/MarketCache';
import { Strategy } from "../../strategy/Strategy";
import { createTradeFactory } from '../Trade/createTradeFactory';
import { ITradeManager } from '../Trade/ITradeManager';
import { tradeManager } from '../Trade/TradeManager';
import { penaltyCounter } from '../PenaltyCounter/PenaltyCounter';
import { Report } from '../../strategy/bridge';
import { reportManager } from '../Report/ReportManager';
import { tradeCancelManager } from '../Trade/TradeCancelManager';
import { ITradeCancelManager } from '../Trade/ITradeCancelManager';
import { clearInterval } from 'timers';

export type StrategyBoxStatus = 'Running' | 'Sleep' | 'Error';

export class StrategyBox<StrategyParam, StrategyContext> {
  public context: StrategyContext;
  public status: StrategyBoxStatus = 'Running';
  public lastTickMs: number = 0; // 死活監視用の最終実行時刻
  private strategyLogger: StrategyLogger;
  private iTradeManager: ITradeManager;
  private iTradeCancelManager: ITradeCancelManager;

  constructor(
    public strategyBoxId: string,
    public pair: Pair,
    public strategy: Strategy<StrategyParam, StrategyContext, Report>,
    public param: StrategyParam,
    public isForwardTest: boolean,
    initialContext: StrategyContext,
  ) {
    this.context = initialContext;
    this.strategyLogger = new StrategyLogger(strategyBoxId);
    this.iTradeManager = isForwardTest ? tradeManagerForwardTest : tradeManager;
    this.iTradeCancelManager = isForwardTest ? tradeCancelManager : tradeCancelManager;
    if (!strategy.paramGuard(param)) {
      penaltyCounter.addRedCard(strategyBoxId, 'StrategyParamの型が一致しません。');
      return;
    }
    if (!strategy.contextGuard(initialContext)) {
      penaltyCounter.addRedCard(strategyBoxId, 'StrategyContextの型が一致しません。');
      return;
    }
  };

  private timer: NodeJS.Timer | undefined = undefined;
  start() {
    this.timer = setInterval(this.tick, 10000); // 10秒ごとにtick()を実行する。
  };
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  private runningTick: boolean = false;
  private async tick() {
    // ■運用系の設定
    if (this.status !== 'Running') {
      this.stop();
      return;
    }
    if (this.runningTick) return;
    this.runningTick = true;
    this.lastTickMs = Date.now();

    // ■入力情報取得
    const priceShortHistory = marketCache.getPriceHistory(this.pair)?.map(({ price }) => price) || [];
    const tradeList = this.iTradeManager.getTradeListByStrategyBoxId(this.strategyBoxId);
    const tradeFactory = createTradeFactory(this);
    const report = reportManager.getLastReport(this.strategy.id, this.pair);

    // ■事前準備
    if (tradeList.filter(({ status }) => status === 'requested').length !== 0) {
      const update = await executionMonitor.update();
      if (update.isEr)
        return await penaltyCounter.addYellowCard(this.strategyBoxId, 'fail executionMonitor.update()');
      const checkRequestedTradeHasExecuted = await this.iTradeManager.checkRequestedTradeHasExecuted();
      if (checkRequestedTradeHasExecuted.isEr)
        return await penaltyCounter.addYellowCard(this.strategyBoxId, 'fail this.tradeManager.checkRequestedTradeHasExecuted()');
    }

    // ■戦略の実行
    this.strategyLogger.log('start');
    const strategyResult = this.strategy.func({
      param: this.param,
      context: this.context,
      tradeFactory,
      priceShortHistory,
      tradeList,
      logger: this.strategyLogger,
      report,
    });
    this.strategyLogger.log(`end:${JSON.stringify(strategyResult)}`);

    // ■後処理
    const { newTradeList, context, cancelTradeList } = strategyResult;
    this.context = context;
    await updateStrategyBox(this);
    await this.iTradeCancelManager.subscribe({
      strategyBoxId: this.strategyBoxId,
      cancelList: cancelTradeList,
      proceed: async () => {
        for (let newTrade of newTradeList) {
          const result = await this.iTradeManager.order(newTrade);
          if (result.isEr) return await penaltyCounter.addRedCard(this.strategyBoxId, `fail this.tradeManager.order(newTrade). trade=${JSON.stringify(newTrade)}`);
        }
      },
    });
    this.runningTick = false;
  };
};
