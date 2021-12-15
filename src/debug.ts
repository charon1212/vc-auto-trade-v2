import { PriceManager } from "./domain/trade/PriceManager";
import { loadDotEnv } from "./common/dotenv/processEnv";
import { resetConnection } from "./typeorm/typeorm";
import { getConnection } from "typeorm";
import { PriceHistory } from "./typeorm/entity/PriceHistory";

const debug = async () => {

  // 初期準備
  loadDotEnv();
  await resetConnection();

  // const manager = new PriceManager('btc_jpy');
  // manager.start();

  const sampledata = [
    { timestamp: 100, price: 1 },
    { timestamp: 200, price: 2 },
    { timestamp: 300, price: 3 },
    { timestamp: 400, price: 4 },
    { timestamp: 500, price: 5 },
    { timestamp: 600, price: 6 },
    { timestamp: 700, price: 7 },
    { timestamp: 800, price: 8 },
    { timestamp: 900, price: 9 },
    { timestamp: 1000, price: 10 },
  ];
  getConnection().manager.save(sampledata.map((d) => new PriceHistory(d)));

};

debug();
