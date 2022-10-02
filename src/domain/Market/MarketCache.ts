import { getPairs } from "../Exchange/pair";
import { Pair } from "../Exchange/type";
import { Market } from "./Market";
import { marketPolling } from "./MarketPolling";
import { MyDate } from 'util-charon1212/build/main/MyDate';
import { cronSchedule } from "../../common/cron/cronSchedule";

export type MarketHistory = (Market & { lack?: boolean })[];

class MarketCache {
  private marketHistoryCacheMap: { [pair in Pair]?: MarketHistory } = {};
  constructor() {
    getPairs().forEach((pair) => this.marketHistoryCacheMap[pair] = []);
  };
  setup() {
    marketPolling.addSubscription((pair, market) => {
      this.marketHistoryCacheMap[pair]?.push(market);
    });
    cronSchedule.everyHour()(this.scheduleRemoveMarketHistory);
  }
  getPriceHistory(pair: Pair) {
    return this.marketHistoryCacheMap[pair];
  };
  getLastHistory(pair: Pair) {
    const arr = this.marketHistoryCacheMap[pair];
    if (!arr || arr.length === 0) return undefined;
    return arr[arr.length - 1];
  };

  private async scheduleRemoveMarketHistory() {
    const u = MyDate.ms1h;
    const now = Math.round(Date.now() / u) * u;
    const endTimestamp = now - 3 * MyDate.ms1h;
    getPairs().forEach((pair) => {
      this.marketHistoryCacheMap[pair] = this.marketHistoryCacheMap[pair]?.filter(({ timestamp }) => timestamp >= endTimestamp);
    })
  };
};

export const marketCache = new MarketCache();
