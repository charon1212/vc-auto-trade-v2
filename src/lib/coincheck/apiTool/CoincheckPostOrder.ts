import { Pair } from "../../../domain2/Exchange/type";
import { CoincheckApiTool } from "./CoincheckApiTool";

export type RequestParamPostOrder = {
  pair: Pair, // 取引ペア
  side: 'buy' | 'sell', // 売り/買い
  type: 'limit' | 'market', // limit: 指値、market: 成行
  rate?: number, // 指値の取引レート。成行の場合は任意。
  amount?: number, // 注文量(単位は仮想通貨)。market_buy以外の時に有効。
  amountMarketBuy?: number, // 注文量(単位は日本円)。market_buyの時のみ有効。
};
export type ResponseBodyPostOrder = {
  success: boolean, // 正常終了なので、true。
  id: number, // 新規注文ID
  rate?: string, // 注文のレート(1単位仮想通貨あたり何円)
  amount?: string, // 注文量(単位は仮想通貨)。market_buy以外の時に有効。
  order_type: 'buy' | 'sell' | 'market_buy' | 'market_sell', // 注文のタイプ。売り買いと、成行/指値
  pair: Pair, // 取引ペア
  stop_loss_rate: unknown, // 逆指値レートとして、何が返却されるかよくわからん。
  market_buy_amount?: string, // 注文量(単位は日本円)。market_buyの時のみ有効。
};

export const CoincheckPostOrder = new CoincheckApiTool<RequestParamPostOrder, ResponseBodyPostOrder>({
  isPrivate: true,
  method: 'POST',
  createRequest: ({ pair, side, type, rate, amount, amountMarketBuy }) => ({
    uri: '/api/exchange/orders',
    body: JSON.stringify({
      pair, rate, amount,
      order_type: (type === 'market' ? 'market_' : '') + (side === 'buy' ? 'buy' : 'sell'),
      market_buy_amount: amountMarketBuy
    }),
  }),
});
