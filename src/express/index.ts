import express from 'express';
import { loadDotEnv } from '../common/dotenv/processEnv';
import { PriceHistory } from '../typeorm/entity/PriceHistory';
import { getConnection, resetConnection } from '../typeorm/typeorm';

loadDotEnv();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log('start on port 3000.');
});

app.get('/test', (request, response) => {
  response.send(JSON.stringify({ message: 'hello expressjs!' }));
});

app.get('/vcat2/v1/pair/:pair/price-history', async (request, response) => {
  await resetConnection();
  const pair = request.params.pair;
  const conn = getConnection();
  const result = await conn.manager.find(PriceHistory);
  response.send(JSON.stringify({ pair, result }));
});
