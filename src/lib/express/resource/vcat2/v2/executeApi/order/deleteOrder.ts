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
      const response = await CoincheckDeleteOrder.request({ orderId: +id });
      if (response) {
        return createSuccessResponse({ id: response.id });
      } else {
        return createFailureResponse(['CoincheckAPIリクエストでエラー']);
      }
    },
  });
};
