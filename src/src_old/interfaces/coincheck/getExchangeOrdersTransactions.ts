import { handleError } from "../../../common/error/handleError";
import { logger } from "../../../common/log/logger";
import { Pair } from "../../type/coincheck"
import { sendApiRequest } from "./sendApiRequest";

export type Result = {
  success: boolean,
  transactions: Transaction[],
};
export type Transaction = {
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

/**
 * 最新の取引履歴を取得する。
 *
 * @returns 最新の取引履歴。
 */
export const getExchangeOrdersTransactions = async () => {
  const requestResult = await sendApiRequest({
    uri: '/api/exchange/orders/transactions',
    method: 'GET',
    isPrivate: true,
  });
  if (requestResult.success) {
    return requestResult.responseBody as Result;
  } else {
    logger.error(`[APIエラー:getExchangeOrdersTransactions]${JSON.stringify(requestResult)}`);
    handleError({ __filename, method: 'getExchangeOrdersTransactions', });
    return undefined;
  }
};
