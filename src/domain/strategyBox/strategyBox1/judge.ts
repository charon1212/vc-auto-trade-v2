import { calcMacd } from "../../../tradingLogic/macd";

export type Judge = 'keep' | 'rc' | 'vc';

export const judgeStrategyBox1 = (priceList: number[]): Judge => {

  if (priceList.length === 0) return 'keep';
  const { macd, macdSignal } = calcMacd(priceList, 5, 30, 10);
  const macdRate = macd[macd.length - 1] / priceList[priceList.length - 1];
  if (macdRate > 0.0003) return 'vc';
  if (macdRate < -0.0003) return 'rc';
  return 'keep';

};
