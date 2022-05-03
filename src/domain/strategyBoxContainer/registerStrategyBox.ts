import { StrategyBox1 } from "../strategyBox/strategyBox1/StrategyBox1";
import { StrategyBoxContainer } from "./strategyBoxContainer";

/**
 * StrategyBoxをContainerに登録する。
 * どのパラメータでどう登録するかを管理する関数。
 */
export const registerStrategyBox = (container: StrategyBoxContainer) => {

  /** strategyBox1 */
  const params = [
    { id: 'sb-1-th2-reverse', th: 2, rev: true, dummy: true },
    { id: 'sb-1-th3-reverse', th: 3, rev: true, dummy: true },
    { id: 'sb-1-th4-reverse', th: 4, rev: true, dummy: true },
    { id: 'sb-1-th5-reverse', th: 5, rev: true, dummy: true },
    { id: 'sb-1-th2', th: 2, rev: false, dummy: true },
    { id: 'sb-1-th3', th: 3, rev: false, dummy: true },
    { id: 'sb-1-th4', th: 4, rev: false, dummy: true },
    { id: 'sb-1-th5', th: 5, rev: false, dummy: true },
  ];
  params.forEach(({ id, th, rev, dummy }) => {
    container.addStrategyBox('btc_jpy', StrategyBox1.getCreator({ id }, (instance) => {
      instance.isDummy = dummy;
      instance.param.reverse = rev;
      instance.param.threshold = 0.0001 * th;
      return instance;
    }))
  });

};
