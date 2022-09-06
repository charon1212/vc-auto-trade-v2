import { DR } from "../../common/typescript/deepreadonly";
import { Trade } from "./Trade";

export interface ITradeManager {
  order: (trade: Trade) => Promise<void>;
  checkRequestedTradeHasExecuted: () => Promise<void>;
  getTradeListByStrategyBoxId: (strategyBoxId: string) => DR<Trade[]>;
};
