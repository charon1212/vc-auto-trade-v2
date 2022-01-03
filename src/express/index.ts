import express from 'express';
import { loadDotEnv } from '../common/dotenv/processEnv';
import { resetConnection } from '../typeorm/typeorm';
import { addGetPriceHistory } from './priceHistory/getPriceHistory';
import { addGetTradeResult } from './tradeResult/getTradeResult';

const index = async () => {

  loadDotEnv();
  await resetConnection();

  const app = express();
  app.use((req, res, next) => {
    console.log('**REQUEST**');
    console.log(JSON.stringify({
      url: req.url,
      headers: req.headers,
      body: req.body,
      params: req.params,
      query: req.query,
    }));
    next();
  });
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use((req, res, next) => {
    const allowOrigins = [/^http:\/\/localhost:[0-9]{1,4}$/, /^https:\/\/vcat2-analyze-tool.web.app$/];
    if (allowOrigins.some((regexp) => regexp.test(req.headers.origin || ''))) {
      res.header('Access-Control-Allow-Origin', 'req.headers.origin');
    }
    next();
  });

  app.listen(3000, () => {
    console.log('start on port 3000.');
  });

  addGetPriceHistory(app); // GET:/vcat2/v1/pair/:pair/price-history
  addGetTradeResult(app); // GET:/vcat2/v1/trade-result

  // テスト用
  app.get('/test', (request, response) => {
    response.send(JSON.stringify({ message: 'hello expressjs!' }));
  });

};

// エントリーポイント
index();
