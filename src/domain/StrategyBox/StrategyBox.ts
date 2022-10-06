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

export type StrategyBoxStatus = 'Running' | 'Sleep' | 'Error';

export class StrategyBox<StrategyParam, StrategyContext> {
  public context: StrategyContext;
  public status: StrategyBoxStatus = 'Running';
  public lastTickMs: number = 0; // 死活監視用の最終実行時刻
  private strategyLogger: StrategyLogger;
  private tradeManager: ITradeManager;

  constructor(
    public strategyBoxId: string,
    public pair: Pair,
    public strategy: Strategy<StrategyParam, StrategyContext, Report>,
    public param: StrategyParam,
    public isForwardTest: boolean,
    initialContext: StrategyContext,
  ) {
    if (!strategy.paramGuard(param)) throw new Error('StrategyParamの型が一致しません。'); // TODO: エラー処理
    if (!strategy.contextGuard(initialContext)) throw new Error('StrategyContextの型が一致しません。'); // TODO: エラー処理
    this.context = initialContext;
    this.strategyLogger = new StrategyLogger(strategyBoxId);
    this.tradeManager = isForwardTest ? tradeManagerForwardTest : tradeManager;
  };

  start() {
    this.t();
  };

  /**
   * 定間隔ごとにtick()を実行する。
   */
  private t() {
    if (this.status !== 'Running') return;
    this.lastTickMs = Date.now();
    this.tick().then(() => {
      setTimeout(() => {
        this.t();
      }, 5000);
    });
  }

  private async tick() {
    // ■入力情報取得
    const priceShortHistory = marketCache.getPriceHistory(this.pair)?.map(({ price }) => price) || [];
    const tradeList = this.tradeManager.getTradeListByStrategyBoxId(this.strategyBoxId);
    const tradeFactory = createTradeFactory(this);
    const report = reportManager.getLastReport(this.strategy.id, this.pair);

    // ■事前準備
    if (tradeList.filter(({ status }) => status === 'requested').length !== 0) {
      const update = await executionMonitor.update();
      if (update.isEr)
        return await penaltyCounter.addYellowCard(this.strategyBoxId, 'fail executionMonitor.update()');
      const checkRequestedTradeHasExecuted = await this.tradeManager.checkRequestedTradeHasExecuted();
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
    const { newTradeList, context } = strategyResult;
    this.context = context;
    await updateStrategyBox(this);
    for (let newTrade of newTradeList) {
      const result = await this.tradeManager.order(newTrade);
      if (result.isEr) await penaltyCounter.addRedCard(this.strategyBoxId, `fail this.tradeManager.order(newTrade). trade=${JSON.stringify(newTrade)}`);
    }
  };
};
