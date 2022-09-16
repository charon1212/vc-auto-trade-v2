import { DR, StrategyLogger, Trade, TradeFactory } from './StrategyType';

export type StrategyFunctionArgs<Param, Context> = {
  param: Param,
  context: Context,
  priceShortHistory: number[],
  tradeList: DR<Trade[]>,
  tradeFactory: TradeFactory,
  logger: StrategyLogger,
};
export type StrategyFunctionResult<Context> = {
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
