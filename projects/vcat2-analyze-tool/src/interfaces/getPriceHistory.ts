import fetch from "node-fetch";

export type Params = {
  pair: 'btc_jpy',
  startTimestamp?: number,
  lastTimestamp?: number,
};
type PriceHistory = { timestamp: number, price: number };
export const getPriceHistory = async (params: Params) => {

  const { pair, startTimestamp, lastTimestamp } = params;
  const queryParams = [];
  if (startTimestamp !== undefined) queryParams.push(`start-timestamp=${startTimestamp}`);
  if (lastTimestamp !== undefined) queryParams.push(`last-timestamp=${lastTimestamp}`);
  const query = queryParams.join('&');

  let url = (process.env['REACT_APP_VCAT2_URL'] || '') + `/pair/${pair}/price-history`;
  if (query !== '') url += `?${query}`;
  const data = await fetch(url);
  console.log(url, data);
  const json = await data.json();
  console.log(json);
  return json as {
    pair: string,
    result: PriceHistory[],
    count: number,
  };

};
