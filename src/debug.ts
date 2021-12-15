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

  // const manager = new PriceManager('btc_jpy');
  // manager.start();

  // const sampledata = [
  //   { timestamp: 100, price: 1 },
  //   { timestamp: 200, price: 2 },
  //   { timestamp: 300, price: 3 },
  //   { timestamp: 400, price: 4 },
  //   { timestamp: 500, price: 5 },
  //   { timestamp: 600, price: 6 },
  //   { timestamp: 700, price: 7 },
  //   { timestamp: 800, price: 8 },
  //   { timestamp: 900, price: 9 },
  //   { timestamp: 1000, price: 10 },
  // ];
  // getConnection().manager.save(sampledata.map((d) => new PriceHistory(d)));
  let cnt = 1;
  cron.schedule('0 * * * * *', () => { // 毎分
    const data = [1, 2, 3, 4, 5].map((i) => ({ timestamp: cnt * 10 + i, price: i })).map((v) => new PriceHistory(v));
    logger.debug({ cnt, data, });
    getConnection().manager.save(data);
    cnt++;
  });

};

debug();
