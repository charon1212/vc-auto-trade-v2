import express from 'express';
import { getConnection, MoreThan } from 'typeorm';
import { PriceHistory } from '../../typeorm/entity/PriceHistory';

const maxPriceHistory = 10000;
export const addGetPriceHistory = (app: express.Express) => {

  app.get('/vcat2/v1/pair/:pair/price-history', async (request, response) => {
    const pair = request.params.pair;
    const conn = getConnection();
    const result = await conn.getRepository(PriceHistory).find({
      timestamp: MoreThan('1640361521000'),
    });

    response.send(JSON.stringify({
      pair,
      result: result.filter((v, i) => i < maxPriceHistory),
      count: result.length,
    }));

  });

};
