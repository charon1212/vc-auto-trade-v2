import express from 'express';
import { PriceHistory } from '../../../src_old/typeorm/entity/PriceHistory';
import { typeormDS } from '../../../src_old/typeorm/typeorm';
import { getQueryParamString } from '../util';

const maxPriceHistory = 10000;

/**
 * GET: /vcat2/v1/pair/:pair/price-history
 * query-params:
 *
 *   - start-timestamp: 省略可。timestampの開始。返却はこの境界を含む
 *   - last-timestamp: 省略可。timestampの終了。返却はこの境界を含まない
 *
 * example: /vcat2/v1/pair/btc_jpy/price-history?start-timestamp=1609426800000&last-timestamp=1609513200000
 */
export const addGetPriceHistory = (app: express.Express) => {

  app.get('/vcat2/v1/pair/:pair/price-history', async (request, response) => {

    // get params
    const pair = request.params.pair;
    const startTimestamp = getQueryParamString(request, 'start-timestamp');
    const lastTimestamp = getQueryParamString(request, 'last-timestamp');

    // build query
    const queries = [];
    queries.push('price_history.pair = :pair');
    startTimestamp && queries.push('price_history.timestamp >= :startTimestamp');
    lastTimestamp && queries.push('price_history.timestamp < :lastTimestamp');
    const query = queries.join(' AND ');

    // get many
    const result = await typeormDS
      .getRepository(PriceHistory)
      .createQueryBuilder('price_history')
      .where(query, { pair, startTimestamp, lastTimestamp })
      .getMany();

    // response
    response.send(JSON.stringify({
      pair,
      result: result.filter((v, i) => i < maxPriceHistory),
      count: result.length,
    }));

  });

};
