import { Pair } from "../../../../../../../domain/Exchange/type";
import { CoincheckGetTransactions } from "../../../../../../coincheck/apiTool/CoincheckGetTransactions";
import { expressGet } from "../../../../../base/resource";
import { createFailureResponse, createSuccessResponse } from "../../../../../base/response";

type RequestParam = {};
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
  expressGet<RequestParam, ResponseData>({
    url: '/vcat2/v2/execute-api/transaction',
    paramGuard: () => [],
    handler: async () => {
      const response = await CoincheckGetTransactions.request({});
      if (response) {
        return createSuccessResponse({ transactions: response.transactions });
      } else {
        return createFailureResponse(['']);
      }
    },
  });
};
