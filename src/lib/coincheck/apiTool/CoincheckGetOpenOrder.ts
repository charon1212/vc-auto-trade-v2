import { Pair } from '../../../domain/BaseType';
import { CoincheckApiTool } from './CoincheckApiTool';

export type RequestParamGetOpenOrder = {};
export type ResponseBodyGetOpenOrder = {
  success: boolean,
  orders: OpenOrder[],
};
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

export const CoincheckGetOpenOrder = new CoincheckApiTool<RequestParamGetOpenOrder, ResponseBodyGetOpenOrder>({
  isPrivate: true,
  method: 'GET',
  createRequest: () => ({
    uri: `/api/exchange/orders/opens`
  }),
});
