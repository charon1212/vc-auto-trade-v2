/**
 * 移動平均線に、標準偏差を足し引きした上下線を計算する。
 *
 * @param average 移動平均線
 * @param sigma 標準偏差
 * @param rate 標準偏差にかける倍率。
 * @returns spが上側の線、smが下側の線を表す。
 */
export const calcBollingerLine = (average: number[], sigma: number[], rate: number = 1) => {
  const sp: number[] = [];
  const sm: number[] = [];
  for (let i = 0; i < average.length; i++) {
    sp.push(average[i] + rate * sigma[i]);
    sm.push(average[i] - rate * sigma[i]);
  }
  return { sp, sm };
}

/**
 * ボリンジャーラインを計算する。
 * といっても、引数で指定した間隔で平均をとった、移動平均と標準偏差を計算するだけ。
 *
 * @param priceList 元の価格
 * @param averageSpan 平均を取る区間
 * @returns 移動平均と標準偏差
 */
export const calcBollinger = (priceList: number[], averageSpan: number,) => {
  const average: number[] = [];
  const sigma: number[] = [];
  average.push(priceList[0]);
  sigma.push(0);
  // 1～averageSpan-2までは、averageSpan個のデータをとることができないため、1～indexで計算する。
  for (let index = 1; index < averageSpan - 1; index++) {
    const result = calcOneBollinger(priceList, 0, index);
    average.push(result.average);
    sigma.push(result.sigma);
  }
  for (let index = averageSpan - 1; index < priceList.length; index++) {
    const result = calcOneBollinger(priceList, index - averageSpan + 1, index);
    average.push(result.average);
    sigma.push(result.sigma);
  }
  return { average, sigma };
};

const calcOneBollinger = (priceList: number[], start: number, end: number) => {
  const n = end - start + 1;
  let sma = 0;
  for (let i = start; i <= end; i++) sma += priceList[i];
  sma = sma / n;
  let sumDiffSquare = 0;
  for (let i = start; i <= end; i++) sumDiffSquare += Math.pow(Math.abs(priceList[i] - sma), 2);
  let sigma = Math.sqrt(sumDiffSquare / (n - 1));
  return { average: sma, sigma };
}
