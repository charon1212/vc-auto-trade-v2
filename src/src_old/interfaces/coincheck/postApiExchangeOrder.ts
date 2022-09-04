import { handleError } from "../../../common/error/handleError";
import { logger } from "../../../common/log/logger";
import { Pair } from "../../type/coincheck";
import { sendApiRequest } from "./sendApiRequest";

export type Param = {
  pair: Pair, // 取引ペア
  side: 'buy' | 'sell', // 売り/買い
  orderType: 'limit' | 'market', // limit: 指値、market: 成行
  rate?: number, // 指値の取引レート。成行の場合は任意。
  amount?: number, // 注文量(単位は仮想通貨)。market_buy以外の時に有効。
  amountMarketBuy?: number, // 注文量(単位は日本円)。market_buyの時のみ有効。
};
export type Result = {
  success: boolean, // 正常終了なので、true。
  id: number, // 新規注文ID
  rate?: string, // 注文のレート(1単位仮想通貨あたり何円)
  amount?: string, // 注文量(単位は仮想通貨)。market_buy以外の時に有効。
  order_type: 'buy' | 'sell' | 'market_buy' | 'market_sell', // 注文のタイプ。売り買いと、成行/指値
  pair: Pair, // 取引ペア
  stop_loss_rate: unknown, // 逆指値レートとして、何が返却されるかよくわからん。
  market_buy_amount?: string, // 注文量(単位は日本円)。market_buyの時のみ有効。
};

/**
 * 新規注文
 *
 * @param param パラメータ。詳細は型定義を参照。
 * @returns リクエスト結果のObject。エラーの場合はundefined。
 */
export const postApiExchangeOrder = async (param: Param) => {
  // 引数チェック
  const { hasValidationError, message } = validationPostApiExchangeOrder(param);
  if (hasValidationError) {
    logger.error(`[APIエラー:postApiExchangeOrder][バリデーションエラー:${message}]`);
    handleError({ __filename, method: 'postApiExchangeOrder', });
    return undefined;
  }

  const { pair, side, orderType, rate, amount, amountMarketBuy } = param;
  const order_type = (orderType === 'market' ? 'market_' : '') + (side === 'buy' ? 'buy' : 'sell');
  const market_buy_amount = amountMarketBuy;
  const requestResult = await sendApiRequest({
    uri: '/api/exchange/orders',
    method: 'POST',
    isPrivate: true,
    body: JSON.stringify({ pair, order_type, rate, amount, market_buy_amount }),
  });
  if (requestResult.success) {
    return requestResult.responseBody as Result;
  } else {
    logger.error(`[APIエラー:postApiExchangeOrder]${JSON.stringify(requestResult)}`);
    handleError({ __filename, method: 'postApiExchangeOrder', });
    return undefined;
  }
};

const validationPostApiExchangeOrder = (param: Param) => {
  const { side, orderType, rate, amount, amountMarketBuy } = param;
  if (orderType === 'limit' && !rate) {
    return { hasValidationError: true, message: '指値注文では、rateが必須です。', };
  }
  if (orderType === 'market' && side === 'buy' && !amountMarketBuy) {
    return { hasValidationError: true, message: '成行買い注文では、amountMarketBuyが必須です。', };
  } else if ((orderType === 'limit' || side === 'sell') && !amount) {
    return { hasValidationError: true, message: '指値注文、または売り注文では、amountが必須です。', };
  }
  return { hasValidationError: false, message: '', };
};
