import { fetchMarket } from "../../lib/coincheck/interface/fetchMarket";
import { Pair } from "../Exchange/type";
import { Market } from "./Market";
import { marketCache } from "./MarketCache";
import * as cron from 'node-cron';

export type MarketSubscription = (pair: Pair, market?: Market) => void;

class MarketMonitor {
  private pairList: Pair[] = [];
  private subscriptions: MarketSubscription[] = [];
  constructor() {
    cron.schedule(`*/10 * * * * *`, this.scheduleAddMarket); // 19秒ごと
    cron.schedule(`0 0 * * * *`, this.scheduleRemoveMarket); // 1時間ごと
  }
  addPair(pair: Pair) {
    if (!this.pairList.includes(pair)) {
      this.pairList.push(pair);
      marketCache.registerPair(pair);
    }
  }
  addSubscription(subscription: MarketSubscription) {
    this.subscriptions.push(subscription);
  }
  private async scheduleAddMarket() {
    await Promise.all(this.pairList.map(async (pair) => {
      const timestamp = getTimestamp();
      const market = await fetchMarket(timestamp, pair);
      await marketCache.add(pair, market);
      this.executeSubscription(pair, market);
    }));
  };
  private scheduleRemoveMarket() {
    const endTtimestamp = Date.now() - 3 * 60 * 60 * 1000; // 3時間前
    this.pairList.forEach((pair) => marketCache.remove(pair, endTtimestamp));
  };
  private executeSubscription(pair: Pair, market?: Market) {
    this.subscriptions.forEach((sub) => sub(pair, market));
  };
};

const getTimestamp = () => Math.round(Date.now() / 10000) * 10000;

export const marketMonitor = new MarketMonitor();
