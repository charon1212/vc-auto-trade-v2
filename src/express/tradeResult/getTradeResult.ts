import express from 'express';
import { TradeResult } from '../../typeorm/entity/TradeResult';
import { typeormDS } from '../../typeorm/typeorm';
import { getQueryParamString } from '../util';

/**
 * GET: /vcat2/v1/trade-result
 *
 * - query-params:
 *   - start-timestamp: 省略可。timestampの開始。返却はこの境界を含む
 *   - last-timestamp: 省略可。timestampの終了。返却はこの境界を含まない
 * - example: /vcat2/v1/trade-result?start-timestamp=1609426800000&last-timestamp=1609513200000
 */
export const addGetTradeResult = (app: express.Express) => {

  app.get('/vcat2/v1/trade-result', async (request, response) => {

    // get params
    const startTimestamp = getQueryParamString(request, 'start-timestamp');
    const lastTimestamp = getQueryParamString(request, 'last-timestamp');

    // build query
    const queries = [];
    startTimestamp && queries.push('trade_result.orderTimestamp >= :startTimestamp');
    lastTimestamp && queries.push('trade_result.orderTimestamp < :lastTimestamp');
    const query = queries.join(' AND ');

    // get many
    const result = await typeormDS
      .getRepository(TradeResult)
      .createQueryBuilder('trade_result')
      .where(query, { startTimestamp, lastTimestamp })
      .getMany();

    // response
    response.send(JSON.stringify({ result, count: result.length, }));

  });

};
