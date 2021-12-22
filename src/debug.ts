import { PriceManager } from "./domain/price/PriceManager";
import { loadDotEnv } from "./common/dotenv/processEnv";
import { resetConnection } from "./typeorm/typeorm";
import { StrategyBoxContainer } from "./domain/strategyBoxContainer/strategyBoxContainer";
import { StrategyBox1 } from "./domain/strategyBox/strategyBox1/StrategyBox1";

const debug = async () => {

  // 初期準備
  loadDotEnv();
  await resetConnection();

  const priceManager = new PriceManager('btc_jpy');
  priceManager.start();

  const container = new StrategyBoxContainer();
  container.boxList.push(new StrategyBox1('sb-1', 'btc_jpy', priceManager));
  container.start();

};

debug();
