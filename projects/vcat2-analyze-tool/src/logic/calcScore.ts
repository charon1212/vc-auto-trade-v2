import { APriceHistory } from "../components/hooks/usePriceHistory";
import { ATradeResult } from "../components/hooks/useTradeResult";

export const calcScore = (result: ATradeResult[], priceHistory: APriceHistory[]) => {

  if (priceHistory.length === 0) return [];

  const firstPrice = priceHistory[0].price;
  const lastPrice = priceHistory[priceHistory.length - 1].price;
  const strategyBoxIdList = distinct(result.map(({ strategyBoxId }) => strategyBoxId));
  return strategyBoxIdList.map((strategyBoxId) => {
    const tradeResultList = result.filter((v) => v.strategyBoxId === strategyBoxId);
    const count = tradeResultList.length;// 取引回数
    const benefit = calcBenefit(tradeResultList, priceHistory);// 実損益価格
    const corBenefit = benefit - (lastPrice - firstPrice); // 仮想通貨をただ持っているだけでとれた利益を差し引いた損益
    return { strategyBoxId, count, benefit, corBenefit, };
  });

};

const distinct = <T>(array: T[]) => {
  const result = [] as T[];
  for (let item of array) if (!result.includes(item)) result.push(item);
  return result;
};

const calcBenefit = (result: ATradeResult[], priceHistory: APriceHistory[]) => {
  console.log({ result, priceHistory });
  if (priceHistory.length === 0) return 0;
  let r = 0, v = 0; // 現実通貨/仮想通貨を初期状態は0とする。
  const firstPrice = priceHistory[0].price;
  const lastPrice = priceHistory[priceHistory.length - 1].price;
  for (let trade of result) {
    const dr = trade.price; // amountが機能していないので、amount=1とする。本当は右に×amountがある。
    const dv = 1; // amountが機能していないので、amount=1とする。本当は右に×amountがある。
    if (trade.side === 'buy') {
      r -= dr;
      v += dv;
    } else if (trade.side === 'sell') {
      r += dr;
      v -= dv;
    }
  }
  // 仮想通貨の損益は、現時点の最終価格で売却/買取したとして計算する。
  return r + v * lastPrice;
};
