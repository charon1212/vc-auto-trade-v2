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
  const { response, error } = await sendApiRequest({
    uri: '/api/ticker',
    method: 'GET',
    requestParam: { pair },
  });
  if (response) { // request success
    const json = await response.json();
    return json;
  } else { // request fail
    return undefined;
  }
};
