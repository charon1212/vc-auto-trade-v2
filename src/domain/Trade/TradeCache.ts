import { findTrade } from "../../lib/typeorm/repository/Trade/findTrade";
import { insertTrade } from "../../lib/typeorm/repository/Trade/insertTrade";
import { updateTrade } from "../../lib/typeorm/repository/Trade/updateTrade";
import { Trade, TradeStatus } from "../BaseType";

export class TradeCache {
  private cacheAll: Trade[] = [];
  private cache: { [status in TradeStatus]: Trade[] } = { requesting: [], requested: [], executed: [], cancel: [] };

  constructor() { };
  async setupCache(isForwardTest: boolean) {
    const allTrade = await findTrade({ isForwardTest });
    this.cacheAll = allTrade;
    this.cache.requesting = allTrade.filter(({ status }) => status === 'requesting');
    this.cache.requested = allTrade.filter(({ status }) => status === 'requested');
    this.cache.executed = allTrade.filter(({ status }) => status === 'executed');
    this.cache.cancel = allTrade.filter(({ status }) => status === 'cancel');
  };
  getCache(status?: TradeStatus): Trade[] {
    return status ? this.cache[status] : this.cacheAll;
  }
  async add(trade: Trade) {
    this.cacheAll.push(trade);
    this.cache[trade.status].push(trade);
    await insertTrade(trade);
  };
  async changeStatus(tradeUid: string, status: TradeStatus) {
    const trade = this.cacheAll.find(({ uid }) => uid === tradeUid);
    if (!trade) {
      throw new Error(''); // TODO: エラー処理
    };
    const beforeStatus = trade.status;
    trade.status = status;
    this.cache[beforeStatus].filter(({ uid }) => uid !== tradeUid);
    this.cache[status].push(trade);
    await updateTrade(trade);
  };
};
