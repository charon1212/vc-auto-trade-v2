import { Strategy, StrategyFunctionArgs } from '../../../src/strategy/Strategy';
import { Trade } from '../../../src/domain/BaseType';

type Param = { buy: number, sell: number, amount: number };
type Context = { side: 'buy' | 'sell' };
export const strategy1CallHistory = [] as StrategyFunctionArgs<Param, Context>[];
export const strategy1: Strategy<Param, Context> = {
  id: 'test-strategy-1',
  func: (args) => {
    strategy1CallHistory.push(args);
    const { context: { side }, param: { buy, sell, amount }, priceShortHistory, tradeFactory } = args;
    let newSide = side;
    const last = priceShortHistory.pop();
    const newTradeList = [] as Trade[];
    if (side === 'buy' && last && last <= buy) {
      newTradeList.push(tradeFactory('test-strategy-1', { side, amount, type: 'market', }));
      newSide = 'sell';
    } else if (side === 'sell' && last && last >= sell) {
      newTradeList.push(tradeFactory('test-strategy-1', { side, amount, type: 'market', }));
      newSide = 'buy';
    }
    return {
      context: { side: newSide },
      newTradeList: newTradeList,
    };
  },
  paramGuard: (obj): obj is Param => true,
  contextGuard: (obj): obj is Context => true,
};
