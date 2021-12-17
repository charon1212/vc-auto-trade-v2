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
  const res = await sendApiRequest({
    uri: '/api/ticker',
    method: 'GET',
    requestParam: { pair },
  });
  const json = await res?.json();
  return json as ApiResultTicker | undefined;
};
