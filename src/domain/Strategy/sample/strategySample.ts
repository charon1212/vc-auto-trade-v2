import { Trade } from "../../Trade/Trade";
import { Strategy } from "../Strategy";

export type StrategyParamSample = {};
export type StrategyContextSample = {};

export const strategySample: Strategy<StrategyParamSample, StrategyContextSample> = {
  id: 'strategy-sample',
  paramGuard: (param): param is StrategyParamSample => true,
  contextGuard: (context): context is StrategyContextSample => true,
  func: (args) => {
    const { context, param, priceShortHistory, tradeFactory, tradeList, logger } = args;
    logger.log('sample');
    const newTradeList = [] as Trade[];
    return { context, newTradeList, };
  },
};
