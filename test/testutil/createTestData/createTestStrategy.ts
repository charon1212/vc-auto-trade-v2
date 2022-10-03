import { Strategy, StrategyFunctionArgs, StrategyFunctionResult } from '../../../src/strategy/Strategy';

export const createTestStrategy = (id: string, checkArgs: (args: StrategyFunctionArgs<any, any>) => void, strategyResult: (factory: StrategyFunctionArgs<any, any>['tradeFactory']) => StrategyFunctionResult<any>,): Strategy<any, any> => {
  return {
    id,
    paramGuard: (obj): obj is any => true,
    contextGuard: (obj): obj is any => true,
    func: (args) => {
      checkArgs(args);
      return strategyResult(args.tradeFactory);
    },
  };
};
