import { findMarket } from "../../lib/typeorm/repository/Market/findMarket";
import { Report, strategyList } from "../../strategy/bridge";
import { Pair } from "../BaseType";
import { marketPolling } from "../Market/MarketPolling";

type ReportSet = { report: Report | undefined, lastUpdate: number };

class ReportManager {

  private reportCache: Map<Pair, Map<string, ReportSet>> = new Map();

  constructor() { };
  private getPairMap(pair: Pair): Map<string, ReportSet> {
    const pairMap = this.reportCache.get(pair);
    if (pairMap) return pairMap;
    const newPairMap = new Map();
    this.reportCache.set(pair, newPairMap);
    return newPairMap;
  };

  private getReportDefinition(strategyId: string) {
    return strategyList.find((s) => s.id === strategyId)?.reportDefinition;
  }

  private generateReport(strategyId: string, pair: Pair, func: (newReport: any) => void) {
    const reportDefinition = this.getReportDefinition(strategyId);
    if (!reportDefinition) return;
    const lastTimestamp = Date.now() - reportDefinition.marketHistorySpanMs;
    findMarket({ pair, lastTimestamp, limit: 10000, }).then((marketHistory) => {
      const newReport = reportDefinition.creator(marketHistory);
      func(newReport);
    });
  };

  setup() {
    marketPolling.addSubscription((pair) => {
      this.getPairMap(pair).forEach((reportSet, strategyId) => {
        const reportDefinition = this.getReportDefinition(strategyId);
        if (!reportDefinition) return;
        if (reportSet.lastUpdate < Date.now() - reportDefinition.createSpanMs) {
          this.generateReport(strategyId, pair, (r) => reportSet.report = r);
        }
      });
    });
  }

  registerCache(strategyId: string, pair: Pair) {
    const pairMap = this.getPairMap(pair);
    const map = pairMap.get(strategyId);
    if (!map) {
      const newReport = { report: undefined, lastUpdate: Date.now() };
      pairMap.set(strategyId, newReport);
      this.generateReport(strategyId, pair, (r) => newReport.report = r);
    }
  }

  getLastReport(strategyId: string, pair: Pair): Report | undefined {
    return this.reportCache.get(pair)?.get(strategyId)?.report;
  }

};

export const reportManager = new ReportManager();
