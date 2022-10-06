import { cronSchedule } from '../../common/cron/cronSchedule';
import { findInitStrategyBox } from "../../lib/typeorm/repository/StrategyBox/findInitStrategyBox";
import { reportManager } from '../Report/ReportManager';
import { StrategyBox, StrategyBoxStatus } from "../StrategyBox/StrategyBox";

class StrategyBoxContainer {
  private strategyBoxList: StrategyBox<any, any>[] = [];
  constructor() { }
  async startup() {
    const initStrategyBoxList = await findInitStrategyBox();
    this.strategyBoxList.push(...initStrategyBoxList);

    // TODO: 1分おきに監視し、3分以上応答がなければエラー扱いとする。
    cronSchedule.everyMinute()(async () => { });
    // TODO: 5分おきに、DBを確認し、StrategyBoxをUpdateする。
    cronSchedule.everyMinute(5)(async () => { });

    // 運用中のStrategyBoxを、reportManagerに登録する。
    initStrategyBoxList.forEach((sb) => {
      reportManager.registerCache(sb.strategy.id, sb.pair);
    });

    // StrategyBox運用開始
    this.strategyBoxList.forEach((sb) => sb.start());
  }
  changeStatus(status: StrategyBoxStatus, strategyBoxId?: string) {
    if (strategyBoxId === undefined) {
      this.strategyBoxList.forEach((sb) => sb.status = status);
    } else {
      const sb = this.strategyBoxList.find((sb) => sb.strategyBoxId === strategyBoxId);
      if (sb) sb.status = status;
    }
  }
};

export const strategyBoxContainer = new StrategyBoxContainer();
