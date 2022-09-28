import { Pair } from "../../../../../../domain/Exchange/type";
import { findMarket } from "../../../../../typeorm/repository/Market/findMarket";
import { expressGet } from "../../../../base/resource";
import { createSuccessResponse } from "../../../../base/response";

type RequestParam = { pair: Pair, 'start-timestamp'?: string, 'last-timestamp'?: string, };
type ResponseData = { priceList: { timestamp: number, price: number }[], };

export const getPriceHistory = () => {
  expressGet<RequestParam, ResponseData>({
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
