import { Pair } from "../../../domain2/Exchange/type";
import { Market } from "../../../domain2/Market/Market";
import { CoincheckGetTicker } from "../apiTool/CoincheckGetTicker";

export const fetchMarket = async (timestamp: number, pair: Pair) => {
  const body = await CoincheckGetTicker.request({ pair });
  if (!body) return undefined;
  return { pair, timestamp, price: body.last } as Market;
};
