import { Pair } from "../../type/coincheck";
import { PriceManager } from "./PriceManager";

const priceManagerList = [] as { pair: Pair, priceManager: PriceManager }[];
export const getPriceManager = (pair: Pair) => {
  const existingPriceManager = priceManagerList.find((v) => v.pair === pair)?.priceManager;
  if (existingPriceManager) return existingPriceManager;
  const priceManager = new PriceManager(pair);
  priceManager.start();
  priceManagerList.push({ pair, priceManager, });
  return priceManager;
};
