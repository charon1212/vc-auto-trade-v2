import { Pair } from "../Exchange/type";

export type Market = {
  pair: Pair,
  timestamp: number,
  price: number,
};

export type ShortHistory = {
  pair: Pair,
  priceHistory: number[],
  spanMs: number,
};
