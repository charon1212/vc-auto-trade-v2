import { Pair } from "../../../domain/Exchange/type";
import { Market } from "../../../domain/Market/Market";
import { CoincheckGetTicker } from "../apiTool/CoincheckGetTicker";

export const fetchMarket = async (timestamp: number, pair: Pair) => {
  const body = (await CoincheckGetTicker.request({ pair }))._();
  if (!body) return undefined;
  return { pair, timestamp, price: body.last } as Market;
};
