import { StrategyLogger } from '../../common/log/StrategyLogger';
import { updateStrategyBox } from '../../lib/typeorm/repository/StrategyBox/updateStrategyBox';
import { Pair } from "../Exchange/type";
import { executionMonitor } from '../Execution/ExecutionMonitor';
import { marketInfoCacheMap } from '../Market/MarketInfoCache';
import { Strategy } from "../Strategy/Strategy";
import { createTradeFactory } from '../Trade/createTradeFactory';
import { tradeManager } from '../Trade/TradeManager';

export type StrategyBoxStatus = 'Running' | 'Sleep' | 'Error';

export class StrategyBox<StrategyParam, StrategyContext> {
  public context: StrategyContext;
  public status: StrategyBoxStatus = 'Running';
  public lastTickMs: number = 0; // 死活監視用の最終実行時刻
  private strategyLogger: StrategyLogger;

  constructor(
    public strategyBoxId: string,
    public pair: Pair,
    public strategy: Strategy<StrategyParam, StrategyContext>,
    public param: StrategyParam,
    initialContext: StrategyContext,
  ) {
    this.context = initialContext;
    this.strategyLogger = new StrategyLogger(strategyBoxId);
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
    const priceShortHistory = marketInfoCacheMap[this.pair]?.shortHistory.priceHistory || [];
    const tradeList = tradeManager.getTradeListByStrategyBoxId(this.strategyBoxId);
    const tradeFactory = createTradeFactory(this.strategyBoxId, this.pair);

    // ■事前準備
    if (tradeList.filter(({ status }) => status === 'requested').length !== 0) {
      await executionMonitor.update();
      await tradeManager.checkRequestedTradeHasExecuted();
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
    });
    this.strategyLogger.log(`end:${JSON.stringify(strategyResult)}`);

    // ■後処理
    const { newTradeList, context } = strategyResult;
    this.context = context;
    await updateStrategyBox(this);
    for (let newTrade of newTradeList) await tradeManager.order(newTrade);
  };
};
