import { Pair } from "../../../../domain/Exchange/type";
import { strategyList } from "../../../../domain/Strategy/Strategy";
import { StrategyBox as DomainStrategyBox } from "../../../../domain/StrategyBox/StrategyBox";
import { StrategyBox as StrategyBoxEntity } from "../../entity/StrategyBox.entity";
import { typeormDS } from "../../typeorm";

export const findInitStrategyBox = async (): Promise<DomainStrategyBox<any, any>[]> => {
  const list = await typeormDS.getRepository(StrategyBoxEntity).find({ where: { delete: false, } });
  const result = [] as DomainStrategyBox<any, any>[];
  for (let { id, pair, paramJson, contextJson, strategyId, isForwardTest } of list) {
    const strategy = strategyList.find(({ id }) => id === strategyId);
    if (!strategy) continue;
    const param = JSON.parse(paramJson);
    const context = JSON.parse(contextJson);
    const strategyBox = new DomainStrategyBox(id, pair as Pair, strategy, param, isForwardTest, context,);
    result.push(strategyBox);
  }
  return result;
};