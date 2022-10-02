import * as cron from 'node-cron';
import { getPairs } from "../Exchange/pair";
import { fetchMarket } from "../../lib/coincheck/interface/fetchMarket";
import { insertMarket } from "../../lib/typeorm/repository/Market/insertMarket";

class MarketMonitor {
  constructor() { }
  setup() {
    cron.schedule(`*/10 * * * * *`, this.scheduleAddMarket); // 10秒ごと
  }
  private async scheduleAddMarket() {
    await Promise.all(getPairs().map(async (pair) => {
      const timestamp = Math.round(Date.now() / 10000) * 10000;
      const market = await fetchMarket(timestamp, pair);
      if (market) {
        await insertMarket(pair, market);
      }
    }));
  };
};

export const marketMonitor = new MarketMonitor();
