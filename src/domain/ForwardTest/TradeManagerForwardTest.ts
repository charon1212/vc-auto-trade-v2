import { DR } from "../../common/typescript/deepreadonly";
import { insertExecution } from "../../lib/typeorm/repository/Execution/insertExecution";
import { updateTrade } from "../../lib/typeorm/repository/Trade/updateTrade";
import { marketCache } from "../Market/MarketCache";
import { marketMonitor } from "../Market/MarketMonitor";
import { Trade, tradeTypeGuard } from "../Trade/Trade";
import { TradeCache } from "../Trade/TradeCache";
import { createExecutionForwardTest } from "./createExecutionForwardTest";

/**
 * 取引管理クラス。
 */
class TradeManagerForwardTest {
  private tradeCache = new TradeCache();

  private executedList: Trade[] = [];

  constructor() {
    marketMonitor.addSubscription((pair, market) => {
      if (!market) return;
      this.tradeCache.getCache('requested').forEach((trade) => {
        if (trade.pair !== pair) return;
        if (trade.tradeParam.type === 'market') {
          throw new Error(''); // TODO: エラーハンドリング
        }
        const { rate, side } = trade.tradeParam;
        if (side === 'buy') {
          if (market.price <= rate && !this.executedList.includes(trade)) this.executedList.push(trade);
        } else if (side === 'sell') {
          if (market.price >= rate && !this.executedList.includes(trade)) this.executedList.push(trade);
        }
      });
    });
  };

  /**
   * キャッシュを初期化する。
   */
  async setupCache() {
    await this.tradeCache.setupCache(true);
  };

  /**
   * 新たに取引を追加する。
   */
  async order(trade: Trade) {
    trade.apiId = 'forwardtest';
    trade.status = 'requested';
    if (tradeTypeGuard(trade, 'market')) {
      const lastPrice = marketCache.getLastHistory(trade.pair)?.price;
      const execution = createExecutionForwardTest(trade, lastPrice);
      await insertExecution(execution);
      trade.executions.push(execution);
      trade.status = 'executed';
      trade.lastUpdateStatusMs = Date.now();
    }
    await this.tradeCache.add(trade);
  };

  async checkRequestedTradeHasExecuted() {
    const cacheExecutedList = [...this.executedList];
    this.executedList = [];
    await Promise.all(this.tradeCache.getCache('requested').map(async (trade) => {
      if (cacheExecutedList.includes(trade)) {
        const execution = createExecutionForwardTest(trade);
        await insertExecution(execution);
        trade.executions.push(execution);
        trade.lastUpdateStatusMs = Date.now();
        await this.tradeCache.changeStatus(trade.uid, 'executed');
        await updateTrade(trade);
      }
    }));
  }

  /**
   * 指定したStrategyBoxが発注した取引のリストを取得する。
   * @param strategyBoxId StrategyBoxのUID
   */
  getTradeListByStrategyBoxId(strategyBoxId: string): DR<Trade[]> {
    return this.tradeCache.getCache().filter((trade) => trade.strategyBoxId === strategyBoxId);
  };

};

export const tradeManagerForwardTest = new TradeManagerForwardTest();
