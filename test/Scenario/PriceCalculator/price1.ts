/**
 * minとmaxの間を線形に往復する価格関数を取得する。
 *
 * @param min 
 * @param max 
 * @param period min -> max -> minと、minからminになるまでの期間。
 * @returns 時間を引数に、価格を返却する、価格関数。
 */
export const price1 = (min: number, max: number, period: number, offset: number = 0) => {
  const a = 2 * (max - min) / period;
  return (t: number) => {
    const t2 = (t + offset) % period;
    return max - a * Math.abs(period / 2 - t2);
  };
};
