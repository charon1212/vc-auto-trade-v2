
/**
 * Least Square Estimate (Linear)
 * 最小二乗法で、直線近似する。
 * @returns y=ax+bのa,bの推定値を返す。
 */
 export const lseLinear = (data: number[]) => {
  const n = data.length;
  let sumX = 0, sumY = 0, sumXX = 0, sumXY = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += data[i];
    sumXX += i * i;
    sumXY += i * data[i];
  }
  const a = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const b = (sumXX * sumY - sumXY * sumX) / (n * sumXX - sumX * sumX);
  return { a, b };
};

/**
 * 近似した直線との残差の自乗総和(RSS: residual sum of squares)を求める
 */
export const calcRSS = (data: number[], a: number, b: number) => {
  let rss = 0;
  for (let i = 0; i < data.length; i++) {
    const residual = data[i] - (a * i + b);
    rss += residual * residual;
  }
  return rss;
};
