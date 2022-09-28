import { Pair } from "../../../../../../../domain/Exchange/type";
import { CoincheckPostOrder } from "../../../../../../coincheck/apiTool/CoincheckPostOrder";
import { expressPost } from "../../../../../base/resource";
import { createFailureResponse, createSuccessResponse } from "../../../../../base/response";

type RequestParam = {};
type RequestBody = {
  pair: Pair,
  side: 'buy' | 'sell',
  type: 'limit' | 'market',
  rate?: number,
  amount?: number,
  amountMarketBuy?: number,
};
type ResponseData = { orderId: string, };

export const postOrder = () => {
  expressPost<RequestParam, RequestBody, ResponseData>({
    url: '/vcat2/v2/execute-api/order',
    paramGuard: () => [], // accept any request param.
    bodyGuard: (body) => {
      const list = [] as string[];
      if (body['pair'] !== 'btc_jpy') list.push('pairが"btc_jpy"ではありません。');
      if (body['side'] !== 'buy' || body['side'] !== 'sell') list.push('sideがbuy,sellではありません。');
      if (body['type'] !== 'limit' || body['type'] !== 'market') list.push('typeがlimit,marketではありません。');
      if (body['type'] === 'limit') {
        if (typeof body['rate'] !== 'number') list.push('指値注文で「rate」は必須です。');
        if (typeof body['amount'] !== 'number') list.push('指値注文で「amount」は必須です。');
      }
      if (body['type'] === 'market') {
        if (body['side'] === 'buy' && typeof body['amountMarketBuy'] !== 'number') list.push('成行の買い注文で「amountMarketBuy」は必須です。');
        if (body['side'] === 'sell' && typeof body['amount'] !== 'number') list.push('成行の売り注文で「amount」は必須です。');
      }
      return list;
    },
    handler: async (_, body,) => {
      const response = await CoincheckPostOrder.request(body);
      if (response) { // success
        return createSuccessResponse({ orderId: `${response.id}` });
      } else { // fail
        return createFailureResponse(['CoincheckAPIのRequestでエラー。']);
      }
    },
  });
};
