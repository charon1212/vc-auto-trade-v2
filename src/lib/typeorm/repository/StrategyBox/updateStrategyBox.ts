import { DR } from "../../../../common/typescript/deepreadonly";
import { StrategyBox } from "../../../../domain/StrategyBox/StrategyBox";
import { StrategyBox as StrategyBoxEntity } from "../../entity/StrategyBox.entity";
import { getTypeormRepository } from "../../typeorm";

export const updateStrategyBox = async <P, C>(strategyBox: DR<StrategyBox<P, C>>) => {
  const rep = getTypeormRepository(StrategyBoxEntity);
  const strategyBoxEntity = await rep.findOne({ where: { id: strategyBox.strategyBoxId } });
  if (!strategyBoxEntity) return;
  strategyBoxEntity.strategyId = strategyBox.strategy.id;
  strategyBoxEntity.paramJson = JSON.stringify(strategyBox.param);
  strategyBoxEntity.contextJson = JSON.stringify(strategyBox.context);
  strategyBoxEntity.pair = strategyBox.pair;
  await rep.save(strategyBoxEntity);
};
