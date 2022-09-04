import { StrategyLogger } from "../../common/log/StrategyLogger";
import { DR } from "../../common/typescript/deepreadonly";
import { createTradeFactory } from "../Trade/createTradeFactory";
import { Trade } from "../Trade/Trade";
import { strategySample } from "./sample/strategySample";

type StrategyFunctionArgs<Param, Context> = {
  param: Param,
  context: Context,
  priceShortHistory: number[],
  tradeList: DR<Trade[]>,
  tradeFactory: ReturnType<typeof createTradeFactory>,
  logger: StrategyLogger,
};
type StrategyFunctionResult<Context> = {
  context: Context,
  newTradeList: Trade[],
};
type StrategyFunction<Param, Context> = (args: StrategyFunctionArgs<Param, Context>) => StrategyFunctionResult<Context>;
type StrategyParamGuard<Param> = (param: any) => param is Param;
type StrategyContextGuard<Context> = (context: any) => context is Context;

export type Strategy<Param, Context> = {
  id: string,
  paramGuard: StrategyParamGuard<Param>,
  contextGuard: StrategyContextGuard<Context>,
  func: StrategyFunction<Param, Context>,
};

export const strategyList: Strategy<any, any>[] = [];
strategyList.push(strategySample);
