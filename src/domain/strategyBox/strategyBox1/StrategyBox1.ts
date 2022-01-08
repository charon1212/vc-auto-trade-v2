import { logger } from "../../../common/log/logger";
import { StrategyBoxCreatorParams } from "../../strategyBoxContainer/strategyBoxContainer";
import { sendMyTradeDummy } from "../../trade/MyTradeDummy";
import { StrategyBoxBase } from "../StrategyBoxBase";
import { judgeStrategyBox1 } from "./judge";

export type ContextStrategyBox1 = { position: 'rc' | 'vc', };
export const initContextStrategyBox1: ContextStrategyBox1 = { position: 'rc' };

export class StrategyBox1 extends StrategyBoxBase<ContextStrategyBox1> {
  protected isContextType = (arg: any): arg is ContextStrategyBox1 => {
    if (typeof arg !== 'object') return false;
    if (arg?.position !== 'rc' && arg?.position !== 'vc') return false;
    return true;
  };

  static getCreator(creatorParams: { id: string }, postConstructor?: (instance: StrategyBox1) => StrategyBox1) {
    return (params: StrategyBoxCreatorParams) => {
      const newStrategyBox1 = new StrategyBox1(creatorParams.id, params.pair, params.priceManager, initContextStrategyBox1);
      return postConstructor ? postConstructor(newStrategyBox1) : newStrategyBox1;
    };
  };

  protected tick(next: () => unknown): void {
    if (this.priceManager.shortHistory.length < 360) { // 1時間分のデータが溜まってないなら、いったん保留にする。
      logger.debug(`十分なデータなし。this.priceManager.shortHistory.length = ${this.priceManager.shortHistory.length}`);
      next();
      return;
    }
    const { position } = this.context;
    const judge = judgeStrategyBox1(this.priceManager.shortHistory.map((v) => v.price));
    let side: '' | 'buy' | 'sell' = '';
    if (position === 'rc' && judge === 'vc') side = 'buy'
    if (position === 'vc' && judge === 'rc') side = 'sell'
    if (side) {
      sendMyTradeDummy(
        { pair: this.pair, ammountByUnit: 1, side, strategyBoxId: this.id },
        () => {
          this.setContext((before) => ({ ...before, position: side === 'buy' ? 'vc' : 'rc' }));
          next();
        },
        () => { this.mode = 'error' },
      );
    } else {
      next();
    }
  }

};
