import { Vcat2Result } from "../../common/error/Vcat2Result";
import { DR } from "../../common/typescript/deepreadonly";
import { Trade } from "../BaseType";

export interface ITradeManager {
  order: (trade: Trade) => Promise<Vcat2Result<void>>;
  checkRequestedTradeHasExecuted: () => Promise<Vcat2Result<void>>;
  getTradeListByStrategyBoxId: (strategyBoxId: string) => DR<Trade[]>;
};
