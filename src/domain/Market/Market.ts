import { Pair } from "../Exchange/type";

/**
 * 市場情報
 */
export type Market = {
  timestamp: number,
  price: number,
};

/**
 * 短期市場履歴
 */
export type ShortHistory = {
  pair: Pair,
  priceHistory: number[],
  spanMs: number,
};
