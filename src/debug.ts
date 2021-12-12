import { PriceManager } from "./domain/trade/PriceManager";
import * as cron from 'node-cron';
import { loadDotEnv } from "./common/dotenv/processEnv";
import { startConnection } from "./typeorm/typeorm";

const debug = async () => {

  // 初期準備
  loadDotEnv();
  await startConnection();

  const manager = new PriceManager('btc_jpy');
  manager.start();

};

debug();
