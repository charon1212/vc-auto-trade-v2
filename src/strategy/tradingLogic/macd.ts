import { calcEMA } from "./ema";

/**
 * MACDシグナルを計算する
 * MACD線は、「短期移動平均 - 長期移動平均」で計算され、この値が大きいほど上昇トレンド、小さいほど下降トレンドを示唆する。
 * MACDシグナルは、MACDからさらに指数移動平均を取ったデータで、ノイズが低減する。
 *
 * @param priceList 元になる価格情報データ
 * @param shortSpan 短期平均の間隔
 * @param longSpan 長期平均の間隔
 * @param macdSpan MACD→MACDシグナルの時の平均をとる間隔。大きいとノイズが減るが反応は遅く、小さいとノイズが増えるが反応が早い。
 * @returns 移動平均取得前のMACDと、移動平均取得後のMACDシグナルを返却する。
 */
export const calcMacd = (priceList: number[], shortSpan: number, longSpan: number, macdSpan: number) => {
  const shortEma = calcEMA(priceList, shortSpan);
  const longEma = calcEMA(priceList, longSpan);
  const macd: number[] = [];
  for (let i = 0; i < priceList.length; i++) macd.push(shortEma[i] - longEma[i]);
  const macdSignal = calcEMA(macd, macdSpan);
  return { macd, macdSignal };
};
