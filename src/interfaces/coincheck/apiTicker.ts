import { handleError } from "../../common/error/handleError";
import { logger } from "../../common/log/logger";
import { Pair } from "../../type/coincheck";
import { sendApiRequest } from "./sendApiRequest";

export type ApiResultTicker = {
  last: number, // 最後の取引の価格
  bid: number, // 現在の買い注文の最高価格
  ask: number, // 現在の売り注文の最安価格
  high: number, // 24時間での最高取引価格
  low: number, // 24時間での最安取引価格
  volume: number, // 24時間での取引量
  timestamp: number // 現在の時刻
};
/**
 * /api/tickerにリクエストを送信し、ティッカー情報を取得する。
 *
 * @param pair 取引ペア
 * @returns 指定した取引ペアのティッカー情報（最新の取引価格や、24hの最安/最高値）。
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
