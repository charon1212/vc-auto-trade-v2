import { v4 } from "uuid";
import { Pair } from "../Exchange/type";
import { Trade, TradeParam } from "./Trade";

export const createTradeFactory = (strategyBoxId: string, pair: Pair) => {
  return (strategyId: string, tradeParam: TradeParam): Trade => {
    const uid = v4();
    return {
      uid, strategyId, strategyBoxId, tradeParam, pair,
      apiId: '',
      status: 'requesting',
      lastUpdateStatusMs: Date.now(),
      executions: [],
    };
  };
};
