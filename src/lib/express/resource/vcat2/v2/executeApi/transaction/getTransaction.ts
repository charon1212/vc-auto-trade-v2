import { Pair } from "../../../../../../../domain/Exchange/type";
import { CoincheckGetTransactions } from "../../../../../../coincheck/apiTool/CoincheckGetTransactions";
import { expressResource } from "../../../../../base/resource";
import { createFailureResponse, createSuccessResponse } from "../../../../../base/response";

type RequestParam = never;
type RequestBody = never;
type ResponseData = { transactions: Transaction[], };
type Transaction = {
  id: number,
  order_id: number, // 注文のID
  created_at: string, // 取引時間
  funds: { // 各残高の増減
    btc: string,
    jpy: string, // TODO: 貨幣はこれだけじゃない。ETCとかやる場合は追加が必要。
  },
  pair: Pair, // 取引ペア
  rate: string, // 約定価格
  fee_currency: string, // 手数料の通貨
  fee: string, // 手数料
  liquidity: 'T' | 'M', // Taker/Maker
  side: 'buy' | 'sell', // 売り/買い
};

export const getTransaction = () => {
  expressResource<'GET', RequestParam, RequestBody, ResponseData>({
    method: 'GET',
    url: '/vcat2/v2/execute-api/transaction',
    paramGuard: () => [],
    handler: async () => {
      const requestResult = await CoincheckGetTransactions.request({});
      return requestResult.match({
        ok: (response) => createSuccessResponse({ transactions: response.transactions }),
        er: (err) => createFailureResponse([`CoincheckAPIリクエストでエラー: ${JSON.stringify(err)}`]),
      });
    },
  });
};
