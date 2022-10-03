import { DR } from "../../common/typescript/deepreadonly";
import { Trade } from "../BaseType";

export interface ITradeManager {
  order: (trade: Trade) => Promise<void>;
  checkRequestedTradeHasExecuted: () => Promise<void>;
  getTradeListByStrategyBoxId: (strategyBoxId: string) => DR<Trade[]>;
};
