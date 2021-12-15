import { PriceManager } from "./domain/trade/PriceManager";
import { loadDotEnv } from "./common/dotenv/processEnv";
import { resetConnection } from "./typeorm/typeorm";
import { getConnection } from "typeorm";
import { PriceHistory } from "./typeorm/entity/PriceHistory";
import * as cron from 'node-cron';
import { logger } from "./common/log/logger";

const debug = async () => {

  // 初期準備
  loadDotEnv();
  await resetConnection();

  const manager = new PriceManager('btc_jpy');
  manager.start();

};

debug();
