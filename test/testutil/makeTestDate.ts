/**
 * ランダムな日付を生成する。
 * ※ランダムといいつつ、単に基準日からid * 123456789ms経過した時刻なので、順序関係などは担保される点に注意。
 * @param id 数値。同じ数値は同じ日付を取得する。異なる数値は必ず異なる日付を取得する。
 */
const base = 946652400000; // 2000年1月1日 00:00:00
const diff = 123456789; // 123456789ms = 約1.43日
export const makeTestDate = (id: number) => {
  const date = new Date(base + diff * id);
  return {
    date,
    iso: date.toISOString(),
    ms: date.getTime(),
  };
};
