import { startup } from "./startup";
import { PriceManager } from "./domain/price/PriceManager";
import { StrategyBox1 } from "./domain/strategyBox/strategyBox1/StrategyBox1";
import { StrategyBoxContainer } from "./domain/strategyBoxContainer/strategyBoxContainer";

const index = async () => {

  await startup();

  const priceManager = new PriceManager('btc_jpy');
  priceManager.start();

  const container = new StrategyBoxContainer();
  container.boxList.push(new StrategyBox1('sb-1', 'btc_jpy', priceManager));
  container.start();

};

index();
