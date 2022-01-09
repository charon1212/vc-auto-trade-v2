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
