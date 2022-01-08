import { Pair } from "../../type/coincheck";
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

  private priceManagerList = [] as { pair: Pair, priceManager: PriceManager }[];
  private getPriceManager = (pair: Pair) => {
    const existingPriceManager = this.priceManagerList.find((v) => v.pair === pair)?.priceManager;
    if (existingPriceManager) return existingPriceManager;
    const priceManager = new PriceManager(pair);
    priceManager.start();
    this.priceManagerList.push({ pair, priceManager, });
    return priceManager;
  };
  addStrategyBox(pair: Pair, creator: (param: StrategyBoxCreatorParams) => StrategyBoxBase<any>) {
    this.boxList.push(creator({
      pair,
      priceManager: this.getPriceManager(pair),
    }));
  }

}
