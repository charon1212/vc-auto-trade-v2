import fetch from "node-fetch";

export type Params = {
  minTimestamp?: number,
  maxTimestamp?: number,
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

  const { minTimestamp, maxTimestamp } = params;
  const queryParams = [];
  if (minTimestamp !== undefined) queryParams.push(`min-timestamp=${minTimestamp}`);
  if (maxTimestamp !== undefined) queryParams.push(`max-timestamp=${maxTimestamp}`);
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
