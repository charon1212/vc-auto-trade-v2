import { Pair } from "../../../domain/Exchange/type";
import { Market } from "../../../domain/Market/Market";
import { CoincheckGetTicker } from "../apiTool/CoincheckGetTicker";

export const fetchMarket = async (timestamp: number, pair: Pair) => {
  const result = await CoincheckGetTicker.request({ pair });
  return result.handleOk((body) => {
    return { pair, timestamp, price: body.last } as Market;
  });
};
