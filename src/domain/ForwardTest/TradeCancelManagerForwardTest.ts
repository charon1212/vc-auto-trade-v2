import { ITradeCancelManager } from '../Trade/ITradeCancelManager';
import { CancelSubscription } from '../Trade/TradeCancelManager';
import { tradeManagerForwardTest } from './TradeManagerForwardTest';

class TradeCancelManagerForwardTest implements ITradeCancelManager {
  constructor() { };
  async subscribe(sub: CancelSubscription): Promise<void> {
    sub.cancelList.forEach((cancelTrade) => tradeManagerForwardTest.cancelTrade(cancelTrade));
    await sub.proceed();
  };
};

export const tradeCancelManagerForwardTest = new TradeCancelManagerForwardTest();
