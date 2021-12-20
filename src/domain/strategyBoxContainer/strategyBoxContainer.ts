import { StrategyBoxBase } from "../strategyBox/StrategyBoxBase";

export class StrategyBoxContainer {

  public boxList: StrategyBoxBase[] = [];
  start() {
    this.boxList.map((box) => box.start());
  }

}
