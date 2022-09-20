import * as cron from 'node-cron';
import { findInitStrategyBox } from "../../lib/typeorm/repository/StrategyBox/findInitStrategyBox";
import { StrategyBox } from "../StrategyBox/StrategyBox";

class StrategyBoxContainer {
  private strategyBoxList: StrategyBox<any, any>[] = [];
  constructor() { }
  async startup() {
    const initStrategyBoxList = await findInitStrategyBox();
    this.strategyBoxList.push(...initStrategyBoxList);

    // TODO: 1分おきに監視し、3分以上応答がなければエラー扱いとする。
    cron.schedule('0 */1 * * * *', async () => { });
    // TODO: 5分おきに、DBを確認し、StrategyBoxをUpdateする。
    cron.schedule('0 */5 * * * *', async () => { });

    // StrategyBox運用開始
    this.strategyBoxList.forEach((sb) => sb.start());
  }
};

export const strategyBoxContainer = new StrategyBoxContainer();
