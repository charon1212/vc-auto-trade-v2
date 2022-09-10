import { marketCache } from '../src/domain/Market/MarketCache';
import { Market } from '../src/lib/typeorm/entity/Market.entity';
import { getTypeormRepository } from '../src/lib/typeorm/typeorm';
import { clearDbData } from './testutil/clearDbData';

describe('sample', () => {

  it('sample test', () => {
    expect(2 + 3).toBe(5);
  });

  it('sample test2', () => {
    expect(marketCache.getPriceHistory('btc_jpy')).toBeUndefined();
    marketCache.registerPair('btc_jpy');
    expect(marketCache.getPriceHistory('btc_jpy')?.length).toBe(0);
  });

  it('sample typeorm', async () => {
    await clearDbData(Market);
    const newMarket = new Market('btc_jpy', { price: 1, timestamp: Date.now() });
    const rep = getTypeormRepository(Market);
    await rep.save(newMarket);
    const result = await rep.find();
    expect(result.length).toBe(1);
  });

});
