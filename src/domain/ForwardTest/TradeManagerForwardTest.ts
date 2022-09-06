import { DR } from "../../common/typescript/deepreadonly";
import { Trade } from "../Trade/Trade";
import { TradeCache } from "../Trade/TradeCache";

/**
 * 取引管理クラス。
 */
class TradeManagerForwardTest {
  private tradeCache = new TradeCache();

  constructor() { };

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
    await this.tradeCache.add(trade);
    // TODO: Forwardテスト用トレードの約定判定。
  };

  /**
   * 約定判定は別口で実施しているので、このメソッドの処理は不要。
   */
  async checkRequestedTradeHasExecuted() { }

  /**
   * 指定したStrategyBoxが発注した取引のリストを取得する。
   * @param strategyBoxId StrategyBoxのUID
   */
  getTradeListByStrategyBoxId(strategyBoxId: string): DR<Trade[]> {
    return this.tradeCache.getCache().filter((trade) => trade.strategyBoxId === strategyBoxId);
  };

};

export const tradeManagerForwardTest = new TradeManagerForwardTest();
