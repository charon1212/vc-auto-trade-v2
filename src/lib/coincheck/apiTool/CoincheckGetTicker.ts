import { Pair } from "../../../domain2/Exchange/type";
import { CoincheckApiTool } from "./CoincheckApiTool";

export type RequestParamGetTicker = { pair: Pair };
export type ResponseBodyGetTicker = {
  last: number, // 最後の取引の価格
  bid: number, // 現在の買い注文の最高価格
  ask: number, // 現在の売り注文の最安価格
  high: number, // 24時間での最高取引価格
  low: number, // 24時間での最安取引価格
  volume: number, // 24時間での取引量
  timestamp: number // 現在の時刻
};

export const CoincheckGetTicker = new CoincheckApiTool<RequestParamGetTicker, ResponseBodyGetTicker>({
  isPrivate: false,
  method: 'GET',
  createRequest: ({ pair }) => ({
    uri: `/api/ticker`,
    requestParam: { pair }
  }),
});
