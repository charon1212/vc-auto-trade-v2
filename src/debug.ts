import { PriceManager } from "./domain/trade/PriceManager";
import * as cron from 'node-cron';
import { loadDotEnv } from "./common/dotenv/processEnv";
import { startConnection } from "./typeorm/typeorm";

const debug = async () => {

  // 初期準備
  loadDotEnv();
  await startConnection();

  const manager = new PriceManager('btc_jpy');
  console.log('1');
  manager.start();
  console.log('2');
  let counter = 0;
  cron.schedule('*/10 * * * * *', () => {
    console.log(`${counter++}${JSON.stringify(manager.shortHistory)}`);
  });
  console.log('3');

};

debug();
