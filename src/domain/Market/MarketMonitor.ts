import { getPairs } from "../Exchange/pair";
import { fetchMarket } from "../../lib/coincheck/interface/fetchMarket";
import { insertMarket } from "../../lib/typeorm/repository/Market/insertMarket";
import { cronSchedule } from '../../common/cron/cronSchedule';
import { penaltyCounter } from "../PenaltyCounter/PenaltyCounter";

class MarketMonitor {
  constructor() { }
  setup() {
    cronSchedule.everySecond(10)(this.scheduleAddMarket); // 10秒ごと
  }
  private async scheduleAddMarket() {
    const resultList = await Promise.all(getPairs().map(async (pair) => {
      const timestamp = Math.round(Date.now() / 10000) * 10000;
      const result = await fetchMarket(timestamp, pair);
      return result.handleOk(async (market) => {
        await insertMarket(pair, market);
      }).await();
    }));
    if (resultList.some((r) => r.isEr)) await penaltyCounter.addAllYellowCard('fail fetchMarket(timestamp, pair)');
  };
};

export const marketMonitor = new MarketMonitor();
