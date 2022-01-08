import { PriceManager } from "./domain/price/PriceManager";
import { StrategyBox1 } from "./domain/strategyBox/strategyBox1/StrategyBox1";
import { startup } from "./startup";

const debug = async () => {

  await startup();

  const pm = new PriceManager('btc_jpy');
  const sb1_test = StrategyBox1.creator({ id: 'test-1' })({ pair: 'btc_jpy', priceManager: pm });
  sb1_test.loadContextFromFile();

};

debug();
