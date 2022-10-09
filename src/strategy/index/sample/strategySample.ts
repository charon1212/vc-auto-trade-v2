import { MyDate } from "util-charon1212";
import { Trade } from "../../bridge";
import { Strategy } from "../../Strategy";

export type StrategyParamSample = {};
export type StrategyContextSample = {};
export type ReportSample = { test: number } | { test2: string } | { test3: boolean };

export const strategySample: Strategy<StrategyParamSample, StrategyContextSample, ReportSample> = {
  id: 'strategy-sample',
  paramGuard: (param): param is StrategyParamSample => true,
  contextGuard: (context): context is StrategyContextSample => true,
  func: (args) => {
    const { context, param, priceShortHistory, tradeFactory, tradeList, logger } = args;
    logger.log('sample');
    const newTradeList = [] as Trade[];
    const cancelTradeList = [] as Trade[];
    return { context, newTradeList, cancelTradeList, };
  },
  reportDefinition: {
    createSpanMs: MyDate.ms1m * 15,
    marketHistorySpanMs: MyDate.ms1d,
    creator: () => ({ test: 0 }),
  },
};
