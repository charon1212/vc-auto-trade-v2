import { DR } from "../../common/typescript/deepreadonly";
import { fetchOpenOrderIdList } from "../../lib/coincheck/interface/fetchOpenOrderIdList";
import { postOrder } from "../../lib/coincheck/interface/postOrder";
import { updateTrade } from "../../lib/typeorm/repository/Trade/updateTrade";
import { Execution, Trade, TradeStatus } from "../BaseType";
import { TradeCache } from "./TradeCache";

/**
 * 取引管理クラス。
 */
class TradeManager {
  private tradeCache = new TradeCache();

  constructor() { };

  /**
   * キャッシュを初期化する。
   */
  async setupCache() {
    await this.tradeCache.setupCache(false);
  };

  /**
   * 新たに取引を追加する。
   */
  async order(trade: Trade) {
    await this.tradeCache.add(trade);
    const { id, amount, amountBuyMarket } = (await postOrder(trade)).unwrap();
    if (id === undefined) {
      throw new Error(''); // TODO: エラー処理
    }
    trade.apiId = id;
    trade.tradeRequestParam = { amount, amountBuyMarket };
    await updateTrade(trade);
    trade.lastUpdateStatusMs = Date.now();
    await this.tradeCache.changeStatus(trade.uid, 'requested');
  };

  /**
   * 取引に約定を追加する。
   */
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
    const openOrderIdList = (await fetchOpenOrderIdList()).unwrap();// TODO: エラー処理
    for (let trade of requestedTradeList) {
      const totalExecutedAmount = trade.executions.map(({ amount }) => amount).reduce((p, c) => p + c, 0);
      const executedOver99 = totalExecutedAmount > trade.tradeParam.amount * 0.99; // 99%以上が約定している
      const notExistOpenOrderList = !openOrderIdList.includes(trade.apiId); // 未決済の注文一覧に存在しない
      if (executedOver99 && notExistOpenOrderList) {
        trade.lastUpdateStatusMs = Date.now();
        await this.tradeCache.changeStatus(trade.uid, 'executed');
      }
    }
  }

  /**
   * 本システムで裁判したUIDと、取引所APIで裁判したIDのマップを取得する。
   */
  getTradeIdMap() {
    return this.tradeCache.getCache().map(({ uid, apiId }) => ({ uid, apiId }));
  }

  /**
   * 指定したStrategyBoxが発注した取引のリストを取得する。
   * @param strategyBoxId StrategyBoxのUID
   */
  getTradeListByStrategyBoxId(strategyBoxId: string): DR<Trade[]> {
    return this.tradeCache.getCache().filter((trade) => trade.strategyBoxId === strategyBoxId);
  };

  /**
   * キャッシュから取引のリストを取得する。
   * @param status 指定すると、そのステータスの取引のリストを返却する。指定しないと、全てのステータスの取引のリストを返却する。
   */
  getCache(status?: TradeStatus): DR<Trade[]> {
    return this.tradeCache.getCache(status);
  }

};

export const tradeManager = new TradeManager();
