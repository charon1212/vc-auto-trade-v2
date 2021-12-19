/**
 * 指数移動平均線を取得する。
 * 指数移動平均線は、元データa[i] (i=0,1,...,N-1)に対し、以下で定義される。
 * ema[i] ~ Σ_{j=0→i} a[j]*e^(-(i-j)/span)
 * ただし、重みの寄与が1になるよう正規化する。
 *
 * @param list 元データ
 * @param span 平均に寄与する重みが1/eになる間隔
 * @returns 指数移動平均線
 */
export const calcEMA = (list: number[], span: number) => {
  if (list.length === 0) return [];
  const r = Math.exp((-1) / span);
  const result: number[] = [];
  result.push(list[0]);
  let denominator = 1;
  for (let i = 1; i < list.length; i++) {
    const increaseDenominator = Math.pow(r, i);
    const value = (list[i] + result[i - 1] * denominator * r) / (denominator + increaseDenominator);
    denominator += increaseDenominator;
    result.push(value);
  }
  return result;
};
