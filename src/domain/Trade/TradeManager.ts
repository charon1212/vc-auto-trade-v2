import { okVoid } from "../../common/error/Result";
import { DR } from "../../common/typescript/deepreadonly";
import { fetchOpenOrderIdList } from "../../lib/coincheck/interface/fetchOpenOrderIdList";
import { postOrder } from "../../lib/coincheck/interface/postOrder";
import { updateTrade } from "../../lib/typeorm/repository/Trade/updateTrade";
import { Execution, Trade, TradeStatus } from "../BaseType";
import { ITradeManager } from "./ITradeManager";
import { TradeCache } from "./TradeCache";

/**
 * 取引管理クラス。
 */
class TradeManager implements ITradeManager {
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
    const result = await postOrder(trade);
    return result.handleOk(async ({ id, amount, amountBuyMarket }) => {
      trade.apiId = id;
      trade.tradeRequestParam = { amount, amountBuyMarket };
      await updateTrade(trade);
      trade.lastUpdateStatusMs = Date.now();
      await this.tradeCache.changeStatus(trade.uid, 'requested');
    }).await();
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
    if (requestedTradeList.length === 0) return okVoid();
    const result = await fetchOpenOrderIdList();
    return result.handleOk(async (openOrderIdList) => {
      for (let trade of requestedTradeList) {
        if (!openOrderIdList.includes(trade.apiId) && this.judgeTradeHasExecuted(trade)) {
          trade.lastUpdateStatusMs = Date.now();
          await this.tradeCache.changeStatus(trade.uid, 'executed');
        }
      }
    }).await();
  };

  /** 取引が完了しているかどうかを取引量で判断する。リクエストした注文の99%に達していたらtrueとする。 */
  private judgeTradeHasExecuted(trade: Trade,) {
    if (trade.tradeRequestParam.amount) {
      const totalExecutedAmount = trade.executions.map(({ amount }) => amount).reduce((p, c) => p + c, 0);
      return totalExecutedAmount > trade.tradeRequestParam.amount * 0.99;
    } else if (trade.tradeRequestParam.amountBuyMarket) {
      const totalExecutedAmountJp = trade.executions.map(({ amountJp }) => amountJp).reduce((p, c) => p + c, 0);
      return totalExecutedAmountJp > trade.tradeRequestParam.amountBuyMarket * 0.99;
    } else {
      throw new Error('TradeRequestParamについて、amountとamountBuyMarketが両方undefinedです。') // TODO:エラー処理。
    }
  };

  async cancelTrade(trade: Trade,) {
    await this.tradeCache.changeStatus(trade.uid, 'cancel');
  };

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
