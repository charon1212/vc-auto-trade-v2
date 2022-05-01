import { handleError } from "../../common/error/handleError";
import { logger } from "../../common/log/logger";
import { Pair } from "../../type/coincheck";
import { sendApiRequest } from "./sendApiRequest";

export type Param = {
  pair: Pair, // 取引ペア
  side: 'buy' | 'sell', // 売り/買い
  orderType: 'limit' | 'market', // limit: 指値、market: 成行
  rate?: number, // 指値の取引レート。成行の場合は任意。
  amount: number, // 取引量(単位は仮想通貨)
};
export type Result = {
  success: boolean, // 正常終了なので、true。
  id: number, // 新規注文ID
  rate: string, // 注文のレート(1単位仮想通貨あたり何円)
  amount: string, // 注文量(単位は仮想通貨)
  order_type: 'buy' | 'sell' | 'market_buy' | 'market_sell', // 注文のタイプ。売り買いと、成行/指値
  pair: Pair, // 取引ペア
  stop_loss_rate: unknown, // 逆指値レートとして、何が返却されるかよくわからん。
  market_buy_amount: unknown, // 良くわからん。日本円でどの程度の量を買うか指定できる？
};

/**
 * 新規注文
 *
 * @param param パラメータ。詳細は型定義を参照。
 * @returns リクエスト結果のObject。エラーの場合はundefined。
 */
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