import { Pair } from "../../../../../../../domain/Exchange/type";
import { CoincheckGetOpenOrder } from "../../../../../../coincheck/apiTool/CoincheckGetOpenOrder";
import { expressGet } from "../../../../../base/resource";
import { createFailureResponse, createSuccessResponse } from "../../../../../base/response";

type RequestParam = {};
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
  expressGet<RequestParam, ResponseData>({
    url: '/vcat2/v2/execute-api/open-order',
    paramGuard: () => [],
    handler: async () => {
      const response = await CoincheckGetOpenOrder.request({});
      if (response) {
        return createSuccessResponse({ orders: response.orders });
      } else {
        return createFailureResponse(['']);
      }
    },
  });
};
