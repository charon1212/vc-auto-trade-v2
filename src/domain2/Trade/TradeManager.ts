import { DR } from "../../common/typescript/deepreadonly";
import { fetchOpenOrderIdList } from "../../lib/coincheck/interface/fetchOpenOrderIdList";
import { postOrder } from "../../lib/coincheck/interface/postOrder";
import { findTrade } from "../../lib/typeorm/repository/Trade/findTrade";
import { insertTrade } from "../../lib/typeorm/repository/Trade/insertTrade";
import { updateTrade } from "../../lib/typeorm/repository/Trade/updateTrade";
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

  async setExecution(execution: Execution) {
    const trade = this.tradeCache.getCache().find(({ uid }) => uid === execution.tradeUid);
    if (!trade) return false;
    trade.executions.push(execution);
    // 約定量が注文量の99%以上の場合、未決済の注文一覧を確認し、そこにIDがなければexecutedとする。
    const totalExecutedAmount = trade.executions.map(({ amount }) => amount).reduce((p, c) => p + c, 0);
    if (trade.status === 'requested' && totalExecutedAmount > trade.tradeParam.amount * 0.99) {
      const openOrderIdList = await fetchOpenOrderIdList();
      if (!openOrderIdList) return false;
      if (!openOrderIdList.includes(trade.apiId)) {
        await this.tradeCache.changeStatus(trade.uid, 'executed');
      }
    }
    return true;
  }

  getTradeIdMap() {
    return this.tradeCache.getCache().map(({ uid, apiId }) => ({ uid, apiId }));
  }

  getTradeListByStrategyBoxId(strategyBoxId: string) {
    return this.tradeCache.getCache().filter((trade) => trade.strategyBoxId === strategyBoxId);
  };

  getCache(status?: TradeStatus): DR<Trade[]> {
    return this.tradeCache.getCache(status);
  }

};

export const tradeManager = new TradeManager();
