import fetch from "node-fetch";

export type Params = {
  pair: 'btc_jpy',
  minTimestamp?: number,
  maxTimestamp?: number,
};
type PriceHistory = { timestamp: number, price: number };
export const getPriceHistory = async (params: Params) => {

  const { pair, minTimestamp, maxTimestamp } = params;
  const queryParams = [];
  if (minTimestamp !== undefined) queryParams.push(`min-timestamp=${minTimestamp}`);
  if (maxTimestamp !== undefined) queryParams.push(`max-timestamp=${maxTimestamp}`);
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
