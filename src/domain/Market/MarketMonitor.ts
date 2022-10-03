import { getPairs } from "../Exchange/pair";
import { fetchMarket } from "../../lib/coincheck/interface/fetchMarket";
import { insertMarket } from "../../lib/typeorm/repository/Market/insertMarket";
import { cronSchedule } from '../../common/cron/cronSchedule';

class MarketMonitor {
  constructor() { }
  setup() {
    cronSchedule.everySecond(10)(this.scheduleAddMarket); // 10秒ごと
  }
  private async scheduleAddMarket() {
    await Promise.all(getPairs().map(async (pair) => {
      const timestamp = Math.round(Date.now() / 10000) * 10000;
      const market = (await fetchMarket(timestamp, pair)).unwrap(); // TODO: エラー処理
      await insertMarket(pair, market);
    }));
  };
};

export const marketMonitor = new MarketMonitor();
