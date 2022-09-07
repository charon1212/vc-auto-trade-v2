import { marketCache } from '../src/domain/Market/MarketCache';

it('sample test', () => {
  expect(2 + 3).toBe(5);
});

it('sample test2', () => {
  expect(marketCache.getPriceHistory('btc_jpy')).toBeUndefined();
  marketCache.registerPair('btc_jpy');
  expect(marketCache.getPriceHistory('btc_jpy')?.length).toBe(0);
});
