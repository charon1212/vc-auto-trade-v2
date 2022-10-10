import { Pair } from "../../../domain/BaseType";
import { LegalCurrency, VirtualCurrency } from "../../../domain/Exchange/currency";
import { CoincheckApiTool } from "./CoincheckApiTool";

export type RequestParamGetTransactions = {};
export type ResponseBodyGetTransactions = {
  success: boolean,
  transactions: Transaction<Pair>[],
};

type FundLegal<P extends Pair> = { [key in LegalCurrency<P>]: string };
type FundVirtual<P extends Pair> = { [key in VirtualCurrency<P>]: string };
type Transaction<P extends Pair> = P extends any ? {
  id: number,
  order_id: number, // 注文のID
  created_at: string, // 取引時間
  funds: FundLegal<P> & FundVirtual<P>, // 各残高の増減
  pair: P, // 取引ペア
  rate: string, // 約定価格
  fee_currency: string, // 手数料の通貨
  fee: string, // 手数料
  liquidity: 'T' | 'M', // Taker/Maker
  side: 'buy' | 'sell', // 売り/買い
} : never;

export const CoincheckGetTransactions = new CoincheckApiTool<RequestParamGetTransactions, ResponseBodyGetTransactions>({
  isPrivate: true,
  method: 'GET',
  createRequest: () => ({
    uri: `/api/exchange/orders/transactions`,
  }),
});
