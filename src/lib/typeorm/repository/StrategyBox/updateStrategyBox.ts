import { DR } from "../../../../common/typescript/deepreadonly";
import { StrategyBox } from "../../../../domain2/StrategyBox/StrategyBox";
import { StrategyBox as StrategyBoxEntity } from "../../entity/StrategyBox.entity";
import { typeormDS } from "../../typeorm";

export const updateStrategyBox = async <P, C>(strategyBox: DR<StrategyBox<P, C>>) => {
  const rep = typeormDS.getRepository(StrategyBoxEntity);
  const strategyBoxEntity = await rep.findOne({ where: { id: strategyBox.strategyBoxId } });
  if (!strategyBoxEntity) return;
  strategyBoxEntity.strategyId = strategyBox.strategy.id;
  strategyBoxEntity.paramJson = JSON.stringify(strategyBox.param);
  strategyBoxEntity.contextJson = JSON.stringify(strategyBox.context);
  strategyBoxEntity.pair = strategyBox.pair;
  await rep.save(strategyBoxEntity);
};
