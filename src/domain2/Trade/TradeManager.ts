import { DR } from "../../common/typescript/deepreadonly";
import { fetchOpenOrderIdList } from "../../lib/coincheck/interface/fetchOpenOrderIdList";
import { postOrder } from "../../lib/coincheck/interface/postOrder";
import { findTrade } from "../../lib/typeorm/repository/Trade/findTrade";
import { insertTrade } from "../../lib/typeorm/repository/Trade/insertTrade";
import { updateTrade } from "../../lib/typeorm/repository/Trade/updateTrade";
import { Execution } from "../Execution/Execution";
import { Trade, TradeStatus } from "./Trade";

class TradeManager {
  private cacheAll: Trade[] = [];
  private cache: { [status in TradeStatus]: Trade[] } = { requesting: [], requested: [], executed: [], cancel: [] };

  constructor() { };

  async setupCache() {
    const allTrade = await findTrade();
    this.cacheAll = allTrade;
    this.cache.requesting = allTrade.filter(({ status }) => status === 'requesting');
    this.cache.requested = allTrade.filter(({ status }) => status === 'requested');
    this.cache.executed = allTrade.filter(({ status }) => status === 'executed');
    this.cache.cancel = allTrade.filter(({ status }) => status === 'cancel');
  };

  async order(trade: Trade) {
    this.cacheAll.push(trade);
    this.cache.requesting.push(trade);
    await insertTrade(trade);
    const apiId = await postOrder(trade);
    if (apiId === undefined) {
      return; // TODO: エラー処理
    }
    trade.apiId = apiId;
    await this.changeTradeStatus(trade, 'requested');
  };

  async setExecution(execution: Execution) {
    const trade = this.cacheAll.find(({ uid }) => uid === execution.tradeUid);
    if (!trade) return false;
    trade.executions.push(execution);
    // 約定量が注文量の99%以上の場合、未決済の注文一覧を確認し、そこにIDがなければexecutedとする。
    const totalExecutedAmount = trade.executions.map(({ amount }) => amount).reduce((p, c) => p + c, 0);
    if (trade.status === 'requested' && totalExecutedAmount > trade.tradeParam.amount * 0.99) {
      const openOrderIdList = await fetchOpenOrderIdList();
      if (!openOrderIdList) return false;
      if (!openOrderIdList.includes(trade.apiId)) {
        await this.changeTradeStatus(trade, 'executed');
      }
    }
    return true;
  }

  getTradeIdMap() {
    return this.cacheAll.map(({ uid, apiId }) => ({ uid, apiId }));
  }

  getTradeListByStrategyBoxId(strategyBoxId: string) {
    return this.cacheAll.filter((trade) => trade.strategyBoxId === strategyBoxId);
  };

  private async changeTradeStatus(trade: Trade, status: TradeStatus) {
    const before = trade.status;
    trade.status = status;
    trade.lastUpdateStatusMs = Date.now();
    this.cache[before] = this.cache[before].filter((t) => t !== trade);
    this.cache[status].push(trade);
    await updateTrade(trade);
  }

  getCache(status?: TradeStatus): DR<Trade[]> {
    return status ? this.cache[status] : this.cacheAll;
  }

};

export const tradeManager = new TradeManager();
