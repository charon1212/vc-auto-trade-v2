import { ReportDefinition } from '../domain/BaseType';
import { DR, StrategyLogger, Trade, TradeFactory } from './bridge';

export type StrategyFunctionArgs<Param, Context, Report> = {
  param: Param,
  context: Context,
  priceShortHistory: number[],
  tradeList: DR<Trade[]>,
  tradeFactory: TradeFactory,
  logger: StrategyLogger,
  report: Report | undefined,
};
export type StrategyFunctionResult<Context> = {
  context: Context,
  newTradeList: Trade[],
  cancelTradeList: Trade[],
};
type StrategyFunction<Param, Context, Report> = (args: StrategyFunctionArgs<Param, Context, Report>) => StrategyFunctionResult<Context>;
type StrategyParamGuard<Param> = (param: any) => param is Param;
type StrategyContextGuard<Context> = (context: any) => context is Context;

export type Strategy<Param, Context, Report> = {
  id: string,
  paramGuard: StrategyParamGuard<Param>,
  contextGuard: StrategyContextGuard<Context>,
  func: StrategyFunction<Param, Context, Report>,
  reportDefinition?: ReportDefinition<Report>,
};
