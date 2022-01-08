import { calcMacd } from "../../../tradingLogic/macd";
import { ParamStrategyBox1 } from "./StrategyBox1";

export type Judge = 'keep' | 'rc' | 'vc';

export const judgeStrategyBox1 = (priceList: number[], param: ParamStrategyBox1): Judge => {

  const { macdShort, macdLong, threshold, reverse } = param;

  if (priceList.length === 0) return 'keep';
  const { macd } = calcMacd(priceList, macdShort, macdLong, 10);
  const macdRate = macd[macd.length - 1] / priceList[priceList.length - 1];
  if (macdRate > threshold) return reverse ? 'vc' : 'rc';
  if (macdRate < -threshold) return reverse ? 'rc' : 'vc';
  return 'keep';

};
