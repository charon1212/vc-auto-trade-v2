import { Trade } from '../../../src/domain/BaseType';

const defaultTrade = (id: number): Trade => ({
  uid: `trade-uid-${id}`,
  strategyId: `trade-strategyId-${id}`,
  strategyBoxId: `trade-strategyBoxId-${id}`,
  apiId: `${id}`,
  orderAtMs: 0,
  pair: 'btc_jpy',
  status: 'requested',
  lastUpdateStatusMs: 0,
  tradeParam: { side: 'buy', type: 'limit', amount: 1, rate: 1 },
  executions: [],
  isForwardTest: false,
});
export const createTestTrade = (trades: Partial<Trade>[], idBase: number = 0): Trade[] => {
  return trades.map((trade, i) => ({ ...defaultTrade(idBase + i), ...trade }));
};
