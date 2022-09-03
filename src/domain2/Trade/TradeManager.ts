import { DR } from "../../common/typescript/deepreadonly";
import { fetchOpenOrderIdList } from "../../lib/coincheck/interface/fetchOpenOrderIdList";
import { postOrder } from "../../lib/coincheck/interface/postOrder";
import { Execution } from "../Execution/Execution";
import { Trade, TradeStatus } from "./Trade";
import { TradeCache } from "./TradeCache";

class TradeManager {
  private tradeCache = new TradeCache();

  constructor() { };

  async setupCache() {
    await this.tradeCache.setupCache();
  };

  async order(trade: Trade) {
    await this.tradeCache.add(trade);
    const apiId = await postOrder(trade);
    if (apiId === undefined) {
      throw new Error(''); // TODO: エラー処理
    }
    trade.apiId = apiId;
    await this.tradeCache.changeStatus(trade.uid, 'requested');
  };

  setExecution(execution: Execution) {
    const trade = this.tradeCache.getCache().find(({ uid }) => uid === execution.tradeUid);
    trade?.executions.push(execution);
  }

  /**
   * 約定待ちの取引が完全約定しているか調べ、ステータスを更新する。
   * 完全約定の判断基準は、「合計約定量が注文量の99%以上」かつ「未決済の注文一覧に存在しない」こととする。
   */
  async checkRequestedTradeHasExecuted() {
    const requestedTradeList = this.tradeCache.getCache('requested');
    if (requestedTradeList.length === 0) return;
    const openOrderIdList = await fetchOpenOrderIdList();
    if (!openOrderIdList) {
      throw new Error('') // TODO: エラー処理
    }
    for (let trade of requestedTradeList) {
      const totalExecutedAmount = trade.executions.map(({ amount }) => amount).reduce((p, c) => p + c, 0);
      const executedOver99 = totalExecutedAmount > trade.tradeParam.amount * 0.99; // 99%以上が約定している
      const notExistOpenOrderList = !openOrderIdList.includes(trade.apiId); // 未決済の注文一覧に存在しない
      if (executedOver99 && notExistOpenOrderList) await this.tradeCache.changeStatus(trade.uid, 'executed');
    }
  }

  getTradeIdMap() {
    return this.tradeCache.getCache().map(({ uid, apiId }) => ({ uid, apiId }));
  }

  getTradeListByStrategyBoxId(strategyBoxId: string): DR<Trade[]> {
    return this.tradeCache.getCache().filter((trade) => trade.strategyBoxId === strategyBoxId);
  };

  getCache(status?: TradeStatus): DR<Trade[]> {
    return this.tradeCache.getCache(status);
  }

};

export const tradeManager = new TradeManager();
