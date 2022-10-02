import { Currency } from "../../../../../../../domain/Exchange/type";
import { CoincheckGetBalance, } from "../../../../../../coincheck/apiTool/CoincheckGetBalance";
import { expressResource } from "../../../../../base/resource";
import { createFailureResponse, createSuccessResponse } from "../../../../../base/response";

type RequestParam = never;
type RequestBody = never;
type ResponseData = { [key in BalanceKey]: string };
type BalanceKey = `${Currency}${'' | '_reserved' | '_lend_in_use' | '_lent' | '_debt'}`;

export const getGetBalance = () => {
  expressResource<'GET', RequestParam, RequestBody, ResponseData>({
    method: 'GET',
    url: '/vcat2/v2/execute-api/balance',
    paramGuard: () => [],
    handler: async () => {
      const requestResult = await CoincheckGetBalance.request({});
      return requestResult.on({
        onSuccess: (response) => createSuccessResponse(response),
        onError: (err) => createFailureResponse([`CoincheckAPIリクエストでエラー: ${JSON.stringify(err)}`]),
      });
    },
  });
};
