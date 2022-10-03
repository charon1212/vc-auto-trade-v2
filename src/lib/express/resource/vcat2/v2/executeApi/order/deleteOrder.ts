import { CoincheckDeleteOrder } from "../../../../../../coincheck/apiTool/CoincheckDeleteOrder";
import { expressResource } from "../../../../../base/resource";
import { createFailureResponse, createSuccessResponse } from "../../../../../base/response";

type RequestParam = { id: string };
type RequestBody = never;
type ResponseData = { id: number };

export const deleteOrder = () => {
  expressResource<'DELETE', RequestParam, RequestBody, ResponseData>({
    method: 'DELETE',
    url: '/vcat2/v2/execute-api/order',
    paramGuard: (param) => {
      if (!param['id'] || typeof param['id'] !== 'string') return ['リクエストパラメータ「id」がありません。'];
      return [];
    },
    handler: async (param) => {
      const { id } = param;
      const requestResult = await CoincheckDeleteOrder.request({ orderId: +id });
      return requestResult.match({
        ok: (response) => createSuccessResponse({ id: response.id }),
        er: (err) => createFailureResponse([`CoincheckAPIリクエストでエラー: ${JSON.stringify(err)}`]),
      });
    },
  });
};
