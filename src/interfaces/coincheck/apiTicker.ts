import { handleError } from "../../common/error/handleError";
import { logger } from "../../common/log/logger";
import { Pair } from "../../type/coincheck";
import { sendApiRequest } from "./sendApiRequest";

export type ApiResultTicker = {
  last: number,
  bid: number,
  ask: number,
  high: number,
  low: number,
  volume: number,
  timestamp: number
};
/**
 * /api/tickerにリクエストを送信し、ティッカー情報を取得する。
 *
 * @param pair 通貨ペア
 * @returns 指定した通貨ペアのティッカー情報（最新の取引価格や、24hの最安/最高値）。
 */
export const apiTicker = async (pair: Pair) => {
  const requestResult = await sendApiRequest({
    uri: '/api/ticker',
    method: 'GET',
    requestParam: { pair },
  });
  if (requestResult.success) { // request success
    return requestResult.responseBody as ApiResultTicker;
  } else { // request fail
    logger.error(`[APIエラー:postApiExchangeOrder]${JSON.stringify(requestResult)}`);
    handleError({ __filename, method: 'apiTicker', });
    return undefined;
  }
};
