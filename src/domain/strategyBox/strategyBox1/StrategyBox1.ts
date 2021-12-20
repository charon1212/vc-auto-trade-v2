import { Pair } from "../../../type/coincheck";
import { PriceManager } from "../../price/PriceManager";
import { sendMyTradeDummy } from "../../trade/MyTradeDummy";
import { StrategyBoxBase } from "../StrategyBoxBase";
import { judgeStrategyBox1 } from "./judge";

export class StrategyBox1 extends StrategyBoxBase {

  position: 'rc' | 'vc';
  constructor(pair: Pair, priceManager: PriceManager) {
    super(pair, priceManager);
    this.position = 'rc';
  }
  protected tick(next: () => unknown): void {
    if (this.priceManager.shortHistory.length < 600) { // 1時間分のデータが溜まってないなら、いったん保留にする。
      next();
      return;
    }
    const judge = judgeStrategyBox1(this.priceManager.shortHistory.map((v) => v.price));
    let side: '' | 'buy' | 'sell' = '';
    if (this.position === 'rc' && judge === 'vc') side = 'buy'
    if (this.position === 'vc' && judge === 'rc') side = 'sell'
    if (side) {
      sendMyTradeDummy(
        { pair: this.pair, ammountByUnit: 1, side },
        () => {
          this.position = side === 'buy' ? 'vc' : 'rc';
          next();
        },
        () => { this.mode = 'error' },
      );
    }
  }

};
