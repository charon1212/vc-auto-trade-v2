import { Pair } from "../../../domain/Exchange/type";
import { CoincheckApiTool } from "./CoincheckApiTool";

export type RequestParamGetTransactions = {};
export type ResponseBodyGetTransactions = {
  success: boolean,
  transactions: Transaction[],
};
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

export const CoincheckGetTransactions = new CoincheckApiTool<RequestParamGetTransactions, ResponseBodyGetTransactions>({
  isPrivate: true,
  method: 'GET',
  createRequest: () => ({
    uri: `/api/exchange/orders/transactions`,
  }),
});
