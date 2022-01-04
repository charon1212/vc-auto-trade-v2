import { startup } from "./startup";
import { StrategyBox1 } from "./domain/strategyBox/strategyBox1/StrategyBox1";
import { StrategyBoxContainer } from "./domain/strategyBoxContainer/strategyBoxContainer";

const index = async () => {

  await startup();

  const container = new StrategyBoxContainer();
  container.addStrategyBox('btc_jpy', ({ pair, priceManager }) => new StrategyBox1('sb-1', pair, priceManager));
  container.start();

};

index();
