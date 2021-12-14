import { PriceManager } from "./domain/trade/PriceManager";
import { loadDotEnv } from "./common/dotenv/processEnv";
import { resetConnection } from "./typeorm/typeorm";

const debug = async () => {

  // 初期準備
  loadDotEnv();
  await resetConnection();

  const manager = new PriceManager('btc_jpy');
  manager.start();

};

debug();
