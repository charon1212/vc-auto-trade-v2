import { Pair } from "../../type/coincheck";
import { PriceManager } from "../price/PriceManager";
import { StrategyBoxBase } from "../strategyBox/StrategyBoxBase";

export type StrategyBoxCreatorParams = { pair: Pair, priceManager: PriceManager };

export class StrategyBoxContainer {

  public boxList: StrategyBoxBase<any>[] = [];
  start() {
    this.boxList.map((box) => box.start());
  }

  private priceManagerList = [] as { pair: Pair, priceManager: PriceManager }[];
  addStrategyBox(pair: Pair, creator: (param: StrategyBoxCreatorParams) => StrategyBoxBase<any>) {
    const existingPriceManager = this.priceManagerList.find((v) => v.pair === pair)?.priceManager;
    if (existingPriceManager) {
      this.boxList.push(creator({ pair, priceManager: existingPriceManager }));
    } else {
      const newPriceManager = new PriceManager(pair);
      this.priceManagerList.push({ pair, priceManager: newPriceManager });
      this.boxList.push(creator({ pair, priceManager: newPriceManager }));
    }
  }

}
