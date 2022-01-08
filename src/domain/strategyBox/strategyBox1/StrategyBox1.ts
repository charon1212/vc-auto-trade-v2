import { logger } from "../../../common/log/logger";
import { StrategyBoxCreatorParams } from "../../strategyBoxContainer/strategyBoxContainer";
import { StrategyBoxBase } from "../StrategyBoxBase";
import { judgeStrategyBox1 } from "./judge";

/** コンテキスト定義 */
export type ContextStrategyBox1 = { position: 'rc' | 'vc', };
export const initContextStrategyBox1 = (): ContextStrategyBox1 => ({ position: 'rc' });
/** パラメータ定義 */
export type ParamStrategyBox1 = {
  macdShort: number,
  macdLong: number,
  threshold: number,
  reverse: boolean,
};
export const initParamStrategyBox1 = (): ParamStrategyBox1 => ({
  macdShort: 5,
  macdLong: 30,
  threshold: 0.0003,
  reverse: false,
});

/**
 * MACDが一定の基準値を上回る/下回る時にトレードする。
 */
export class StrategyBox1 extends StrategyBoxBase<ContextStrategyBox1> {

  /** コンテキスト */
  protected isContextType = (arg: any): arg is ContextStrategyBox1 => {
    if (typeof arg !== 'object') return false;
    if (arg?.position !== 'rc' && arg?.position !== 'vc') return false;
    return true;
  };

  /** パラメータ */
  public param: ParamStrategyBox1 = initParamStrategyBox1();

  protected tick(next: () => unknown): void {
    console.log(`[${this.id}]param=${JSON.stringify(this.param)}`);
    if (this.priceManager.shortHistory.length < 360) { // 1時間分のデータが溜まってないなら、いったん保留にする。
      logger.debug(`[${this.id}]十分なデータなし。this.priceManager.shortHistory.length = ${this.priceManager.shortHistory.length}`);
      next();
      return;
    }
    const { position } = this.context;
    const judge = judgeStrategyBox1(this.priceManager.shortHistory.map((v) => v.price), this.param);
    let side: '' | 'buy' | 'sell' = '';
    if (position === 'rc' && judge === 'vc') side = 'buy'
    if (position === 'vc' && judge === 'rc') side = 'sell'
    if (side) {
      this.sendTrade({
        param: { pair: this.pair, ammountByUnit: 1, side, strategyBoxId: this.id },
        onSuccess: () => {
          this.setContext((before) => ({ ...before, position: side === 'buy' ? 'vc' : 'rc' }));
          next();
        },
        onFail: () => { this.mode = 'error' },
      })
    } else {
      next();
    }
  }

  /** Creator */
  static getCreator(creatorParams: { id: string }, postConstructor?: (instance: StrategyBox1) => StrategyBox1) {
    return (params: StrategyBoxCreatorParams) => {
      const newStrategyBox1 = new StrategyBox1(creatorParams.id, params.pair, params.priceManager, initContextStrategyBox1());
      return postConstructor ? postConstructor(newStrategyBox1) : newStrategyBox1;
    };
  };

};
