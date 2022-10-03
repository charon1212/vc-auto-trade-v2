import { Market, Pair } from "../BaseType";
import { findMarket } from "../../lib/typeorm/repository/Market/findMarket";
import { getPairs } from "../Exchange/pair";
import { cronSchedule } from "../../common/cron/cronSchedule";

export type MarketSubscription = (pair: Pair, market: Market) => void;

class MarketPolling {
  private subscriptions: MarketSubscription[] = [];
  constructor() { };
  setup() {
    cronSchedule.everySecond()(this.schedulePolling); // 毎秒DBを監視して、新規があったらSubscriptionを動かす。
  };
  addSubscription(sub: MarketSubscription) {
    this.subscriptions.push(sub);
  }
  private async schedulePolling() {
    if (this.subscriptions.length === 0) return;
    const now = Math.round(Date.now() / 1000) * 1000;
    const startTimestamp = now - 1000;
    await Promise.all(getPairs().map(async (pair) => {
      const marketList = await findMarket({ pair, limit: 10000, startTimestamp });
      marketList.forEach((market) => this.subscriptions.forEach((sub) => sub(pair, market)));
    }));
  };
};

export const marketPolling = new MarketPolling();
