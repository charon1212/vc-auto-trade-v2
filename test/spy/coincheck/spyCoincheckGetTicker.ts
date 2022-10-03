import { CoincheckGetTicker } from '../../../src/lib/coincheck/apiTool/CoincheckGetTicker';
import { Pair } from '../../../src/domain/BaseType';
import { ok } from '../../../src/common/error/Result';

export const spyCoincheckGetTicker = (arg: (pair: Pair) => number) => {
  return jest.spyOn(CoincheckGetTicker, 'request').mockImplementation(async ({ pair }) => {
    return ok({
      bid: 0, ask: 0, high: 0, low: 0, volume: 0, timestamp: 0,
      last: arg(pair),
    });
  });
};
