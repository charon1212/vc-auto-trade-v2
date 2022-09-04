import { Pair } from "../../../../domain2/Exchange/type";
import { strategyList } from "../../../../domain2/Strategy/Strategy";
import { StrategyBox as DomainStrategyBox } from "../../../../domain2/StrategyBox/StrategyBox";
import { StrategyBox as StrategyBoxEntity } from "../../entity/StrategyBox.entity";
import { typeormDS } from "../../typeorm";

export const findInitStrategyBox = async <StrategyParam, StrategyContext>(): Promise<DomainStrategyBox<StrategyParam, StrategyContext>[]> => {
  const list = await typeormDS.getRepository(StrategyBoxEntity).find({ where: { delete: false, } });
  const result = [] as DomainStrategyBox<StrategyParam, StrategyContext>[];
  for (let { id, pair, paramJson, contextJson, strategyId } of list) {
    const strategy = strategyList.find(({ id }) => id === strategyId);
    if (!strategy) continue;
    const param = JSON.parse(paramJson);
    const context = JSON.parse(contextJson);
    const strategyBox = new DomainStrategyBox(id, pair as Pair, strategy, param, context);
    result.push(strategyBox);
  }
  return result;
};
