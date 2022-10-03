import { Pair } from "../../../../../../../domain/BaseType";
import { CoincheckGetOpenOrder } from "../../../../../../coincheck/apiTool/CoincheckGetOpenOrder";
import { expressResource } from "../../../../../base/resource";
import { createFailureResponse, createSuccessResponse } from "../../../../../base/response";

type RequestParam = never;
type RequestBody = never;
type ResponseData = { orders: OpenOrder[], };
type OpenOrder = {
  id: number,
  order_type: 'buy' | 'sell',
  rate: number | null,
  pair: Pair,
  pending_amount: string | null,
  pending_market_buy_amount: string | null,
  stop_loss_rate: string | null,
  created_at: string,
};

export const getOpenOrder = () => {
  expressResource<'GET', RequestParam, RequestBody, ResponseData>({
    method: 'GET',
    url: '/vcat2/v2/execute-api/open-order',
    paramGuard: () => [],
    handler: async () => {
      const requestResult = await CoincheckGetOpenOrder.request({});
      return requestResult.match({
        ok: (response) => createSuccessResponse({ orders: response.orders }),
        er: (err) => createFailureResponse([`CoincheckAPIリクエストでエラー: ${JSON.stringify(err)}`]),
      });
    },
  });
};
