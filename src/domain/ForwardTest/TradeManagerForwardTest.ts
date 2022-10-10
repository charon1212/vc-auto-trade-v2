import { DR } from "../../common/typescript/deepreadonly";
import { insertExecution } from "../../lib/typeorm/repository/Execution/insertExecution";
import { updateTrade } from "../../lib/typeorm/repository/Trade/updateTrade";
import { marketCache } from "../Market/MarketCache";
import { marketPolling } from "../Market/MarketPolling";
import { Trade, } from "../BaseType";
import { TradeCache } from "../Trade/TradeCache";
import { createExecutionForwardTest } from "./createExecutionForwardTest";
import { ITradeManager } from "../Trade/ITradeManager";
import { okVoid } from "../../common/error/Result";
import { Vcat2Result } from "../../common/error/Vcat2Result";
import { isMarketBuy } from "../Trade/isMarketBuy";

/**
 * 取引管理クラス(ForwardTest用)
 */
class TradeManagerForwardTest implements ITradeManager {
  private tradeCache = new TradeCache();

  private executedList: { trade: Trade, executedPrice: number }[] = [];

  constructor() {
    marketPolling.addSubscription((pair, market) => {
      this.tradeCache.getCache('requested').forEach((trade) => {
        if (trade.pair !== pair) return; // 違う通貨ペアについては無視
        if (this.executedList.some((item) => item.trade.uid === trade.uid)) return; // 既に約定リストに入っている場合は、判断しない。
        if (judgeTradeHasExecuted(trade, market.price)) this.executedList.push({ trade, executedPrice: market.price, });
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
  async order(trade: Trade): Promise<Vcat2Result<void>> {
    const lastPrice = marketCache.getLastHistory(trade.pair)?.price;
    if (!lastPrice) {
      throw new Error('最終価格が取得できません。') // TODO:エラー処理
    }
    // tradeに付加情報を設定してDB保存
    trade.apiId = 'forwardtest';
    trade.status = 'requested';
    trade.tradeRequestParam.amount = isMarketBuy(trade.tradeParam) ? undefined : trade.tradeParam.amount;
    trade.tradeRequestParam.amountBuyMarket = isMarketBuy(trade.tradeParam) ? trade.tradeParam.amount * lastPrice : undefined;
    await this.tradeCache.add(trade);
    // 既に約定できるなら、約定操作を実行する。
    if (judgeTradeHasExecuted(trade, lastPrice)) await this.executeTrade(trade, lastPrice);
    return okVoid();
  };

  /**
   * 全ての約定待ち取引に対し、約定キャッシュに載っているならば、その約定価格で約定操作を行う。
   */
  async checkRequestedTradeHasExecuted(): Promise<Vcat2Result<void>> {
    const cacheExecutedList = [...this.executedList];
    this.executedList = [];
    await Promise.all(this.tradeCache.getCache('requested').map(async (trade) => {
      const cacheExecuted = cacheExecutedList.find((item) => item.trade.uid === trade.uid);
      if (cacheExecuted) await this.executeTrade(trade, cacheExecuted.executedPrice);
    }));
    return okVoid();
  };

  /**
   * 取引のキャンセル操作を行う。
   */
  cancelTrade(trade: Trade) {
    this.tradeCache.changeStatus(trade.uid, 'cancel');
  };

  private async executeTrade(trade: Trade, executedPrice: number) {
    const execution = createExecutionForwardTest(trade, executedPrice);
    await insertExecution(execution);
    trade.executions.push(execution);
    trade.lastUpdateStatusMs = Date.now();
    await this.tradeCache.changeStatus(trade.uid, 'executed');
    await updateTrade(trade);
  };

  /**
   * 指定したStrategyBoxが発注した取引のリストを取得する。
   * @param strategyBoxId StrategyBoxのUID
   */
  getTradeListByStrategyBoxId(strategyBoxId: string): DR<Trade[]> {
    return this.tradeCache.getCache().filter((trade) => trade.strategyBoxId === strategyBoxId);
  };

};

const judgeTradeHasExecuted = (trade: Trade, lastPrice: number) => {
  const { tradeParam } = trade;
  if (tradeParam.stopLossRate !== undefined) {
    if (tradeParam.side === 'buy' && lastPrice < tradeParam.stopLossRate) return false;
    if (tradeParam.side === 'sell' && lastPrice > tradeParam.stopLossRate) return false;
  }
  if (tradeParam.type === 'market') return true;
  if (tradeParam.side === 'buy' && lastPrice > tradeParam.rate) return false;
  if (tradeParam.side === 'sell' && lastPrice < tradeParam.rate) return false;
  return true;
};

export const tradeManagerForwardTest = new TradeManagerForwardTest();
