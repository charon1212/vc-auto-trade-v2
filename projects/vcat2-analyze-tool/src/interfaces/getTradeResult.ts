import fetch from "node-fetch";

export type Params = {
  startTimestamp?: number,
  lastTimestamp?: number,
};
type TradeResult = {
  id: number;
  type: 'market' | 'limit';
  side: 'buy' | 'sell';
  rate: number;
  amount: number;
  orderTimestamp: string;
  isDummy: boolean;
  strategyBoxId: string;
};
export const getTradeResult = async (params: Params) => {

  const { startTimestamp, lastTimestamp } = params;
  const queryParams = [];
  if (startTimestamp !== undefined) queryParams.push(`start-timestamp=${startTimestamp}`);
  if (lastTimestamp !== undefined) queryParams.push(`last-timestamp=${lastTimestamp}`);
  const query = queryParams.join('&');

  let url = (process.env['REACT_APP_VCAT2_URL'] || '') + '/trade-result';
  if (query !== '') url += `?${query}`;
  const data = await fetch(url);
  console.log(url, data);
  const json = await data.json();
  console.log(json);
  return json as {
    result: TradeResult[],
    count: number,
  };

};
