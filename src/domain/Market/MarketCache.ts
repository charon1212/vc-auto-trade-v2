import { insertMarket } from "../../lib/typeorm/repository/Market/insertMarket";
import { Pair } from "../Exchange/type";
import { Market } from "./Market";

export type MarketHistory = (Market & { lack?: boolean })[];

class MarketCache {
  private marketHistoryCacheMap: { [pair in Pair]?: MarketHistory } = {};
  constructor() { };
  registerPair(pair: Pair) {
    if (!this.marketHistoryCacheMap[pair]) this.marketHistoryCacheMap[pair] = [];
  }
  getPriceHistory(pair: Pair) {
    return this.marketHistoryCacheMap[pair];
  };
  getLastHistory(pair: Pair) {
    const arr = this.marketHistoryCacheMap[pair];
    if (!arr || arr.length === 0) return undefined;
    return arr[arr.length - 1];
  }
  async add(pair: Pair, market?: Market) {
    if (market) {
      this.marketHistoryCacheMap[pair]?.push({ ...market });
      await insertMarket(pair, market);
    } else {
      const last = this.getLastHistory(pair);
      if (last) this.marketHistoryCacheMap[pair]?.push({ ...last, lack: true });
    }
  }
  remove(pair: Pair, endTtimestamp: number) {
    this.marketHistoryCacheMap[pair] = this.marketHistoryCacheMap[pair]?.filter(({ timestamp }) => timestamp >= endTtimestamp);
  }
};

export const marketCache = new MarketCache();
