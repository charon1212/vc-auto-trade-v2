import { Pair } from "../../../../../../domain/BaseType";
import { findMarket } from "../../../../../typeorm/repository/Market/findMarket";
import { expressResource } from "../../../../base/resource";
import { createSuccessResponse } from "../../../../base/response";

type RequestParam = { pair: Pair, 'start-timestamp'?: string, 'last-timestamp'?: string, };
type RequestBody = never;
type ResponseData = { priceList: { timestamp: number, price: number }[], };

export const getPriceHistory = () => {
  expressResource<'GET', RequestParam, RequestBody, ResponseData>({
    method: 'GET',
    url: '/vcat2/v2/price-history',
    paramGuard: (param) => {
      const errors = [] as string[];
      console.log(param)
      if (param.pair !== 'btc_jpy') errors.push('pairに通貨ペア(btc_jpy)を指定してください。');
      return errors;
    },
    handler: async (param) => {
      const pair = param.pair;
      const startTimestamp = param['start-timestamp'] ? +param['start-timestamp'] : undefined;
      const lastTimestamp = param['last-timestamp'] ? +param['last-timestamp'] : undefined;

      const args = { pair, startTimestamp, lastTimestamp, limit: 10000 };
      const marketList = await findMarket(args);

      return createSuccessResponse({ priceList: marketList });
    },
  });
};
