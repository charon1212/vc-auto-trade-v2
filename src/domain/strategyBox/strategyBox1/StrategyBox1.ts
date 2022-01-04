import { logger } from "../../../common/log/logger";
import { sendMyTradeDummy } from "../../trade/MyTradeDummy";
import { StrategyBoxBase } from "../StrategyBoxBase";
import { judgeStrategyBox1 } from "./judge";

export class StrategyBox1 extends StrategyBoxBase {

  position: 'rc' | 'vc' = 'rc';
  protected tick(next: () => unknown): void {
    logger.debug(`tick: ${Date.now()}`);
    if (this.priceManager.shortHistory.length < 360) { // 1時間分のデータが溜まってないなら、いったん保留にする。
      next();
      return;
    }
    const judge = judgeStrategyBox1(this.priceManager.shortHistory.map((v) => v.price));
    let side: '' | 'buy' | 'sell' = '';
    if (this.position === 'rc' && judge === 'vc') side = 'buy'
    if (this.position === 'vc' && judge === 'rc') side = 'sell'
    if (side) {
      sendMyTradeDummy(
        { pair: this.pair, ammountByUnit: 1, side, strategyBoxId: this.id },
        () => {
          this.position = side === 'buy' ? 'vc' : 'rc';
          next();
        },
        () => { this.mode = 'error' },
      );
    } else {
      next();
    }
  }

};
