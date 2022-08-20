import { Pair } from "../Exchange/type";

export type Execution = {
  uid: string,
  apiId: string,
  tradeUid: string,
  pair: Pair,
  rate: number,
  amount: number,
  createdAtMs: number
};
