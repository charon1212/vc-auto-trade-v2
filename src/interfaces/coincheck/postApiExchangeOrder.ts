import { handleError } from "../../common/error/handleError";
import { logger } from "../../common/log/logger";
import { Pair } from "../../type/coincheck";
import { sendApiRequest } from "./sendApiRequest";

export type Param = {
  pair: Pair,
  side: 'buy' | 'sell',
  orderType: 'limit' | 'market',
  rate?: number,
  amount: number,
};
export type Result = {
  success: boolean,
  id: number,
  rate: string,
  amount: string,
  order_type: 'buy' | 'sell' | 'market_buy' | 'market_sell',
  pair: Pair,
  stop_loss_rate: unknown, // 逆指値レートとして、何が返却されるかよくわからん。
  market_buy_amount: unknown, // 良くわからん。日本円でどの程度の量を買うか指定できる？
};

export const postApiExchangeOrder = async (param: Param) => {
  const { pair, side, orderType, rate, amount } = param;
  const order_type = (orderType === 'market' ? 'market_' : '') + (side === 'buy' ? 'buy' : 'sell');
  const requestResult = await sendApiRequest({
    uri: '/api/exchange/orders',
    method: 'POST',
    isPrivate: true,
    body: JSON.stringify({ pair, order_type, rate, amount, }),
  });
  if (requestResult.success) {
    return requestResult.responseBody as Result;
  } else {
    logger.error(`[APIエラー:postApiExchangeOrder]${JSON.stringify(requestResult)}`);
    handleError({ __filename, method: 'postApiExchangeOrder', });
    return undefined;
  }
};
