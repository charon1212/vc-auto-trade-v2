import express from 'express';
import { loadDotEnv } from '../common/dotenv/processEnv';
import { PriceHistory } from '../typeorm/entity/PriceHistory';
import { getConnection, resetConnection } from '../typeorm/typeorm';
import { addGetPriceHistory } from './priceHistory/getPriceHistory';

const index = async () => {

  loadDotEnv();
  await resetConnection();

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.listen(3000, () => {
    console.log('start on port 3000.');
  });

  addGetPriceHistory(app); // GET:/vcat2/v1/pair/:pair/price-history

  // テスト用
  app.get('/test', (request, response) => {
    response.send(JSON.stringify({ message: 'hello expressjs!' }));
  });

};

// エントリーポイント
index();
