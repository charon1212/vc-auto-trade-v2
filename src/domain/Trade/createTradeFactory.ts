import { v4 } from "uuid";
import { StrategyBox } from "../StrategyBox/StrategyBox";
import { Trade, TradeParam } from "./Trade";

export const createTradeFactory = <P, C>(strategyBox: StrategyBox<P, C>) => {
  return (strategyId: string, tradeParam: TradeParam): Trade => {
    const { strategyBoxId, pair, isForwardTest } = strategyBox;
    const uid = v4();
    return {
      uid, strategyId, strategyBoxId, tradeParam, pair, isForwardTest,
      apiId: '',
      status: 'requesting',
      lastUpdateStatusMs: Date.now(),
      executions: [],
    };
  };
};
