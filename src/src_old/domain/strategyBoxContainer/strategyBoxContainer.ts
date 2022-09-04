import { Pair } from "../../type/coincheck";
import { getPriceManager } from "../price/getPriceManagerList";
import { PriceManager } from "../price/PriceManager";
import { StrategyBoxBase } from "../strategyBox/StrategyBoxBase";

export type StrategyBoxCreatorParams = { pair: Pair, priceManager: PriceManager };

export class StrategyBoxContainer {

  public boxList: StrategyBoxBase<any>[] = [];
  start() {
    this.boxList.map((box) => {
      box.loadContextFromFile();
      box.start();
    });
  }

  addStrategyBox(pair: Pair, creator: (param: StrategyBoxCreatorParams) => StrategyBoxBase<any>) {
    this.boxList.push(creator({
      pair,
      priceManager: getPriceManager(pair),
    }));
  }

}
