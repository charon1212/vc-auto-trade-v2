import { StrategyLogger } from "../../../src/common/log/StrategyLogger";
import { Strategy } from "../../../src/strategy/Strategy";
import { StrategyBox } from "../../../src/domain/StrategyBox/StrategyBox";
import { Report } from "../../../src/strategy/bridge";

type Args = { id: string, strategy: Strategy<any, any, Report>, param: any, initialContext: any, isForwardTest: boolean };
export const createTestStrategyBox = (args: Args) => {
  const { id, strategy, param, initialContext, isForwardTest } = args;
  const strategyBox = new StrategyBox(id, 'btc_jpy', strategy, param, isForwardTest, initialContext);
  const strategyLogger = new StrategyLogger('strategyBox-1');
  const spyStrategyLogger = jest.spyOn(strategyLogger, 'log');
  (strategyBox as any).strategyLogger = strategyLogger;
  return { strategyBox, spyStrategyLogger };
};
