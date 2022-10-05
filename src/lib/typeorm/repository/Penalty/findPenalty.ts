import { Penalty as DomainPenalty } from "../../../../domain/PenaltyCounter/Penalty";
import { Penalty as PenaltyEntity } from "../../entity/Penalty.entity";
import { getTypeormRepository } from "../../typeorm";

export const findPenalty = async (strategyBoxId: string, startTimestamp: number,): Promise<DomainPenalty[]> => {
  const list = await getTypeormRepository(PenaltyEntity)
    .createQueryBuilder('penalty')
    .where('penalty.strategyBoxId = :strategyBoxId AND penalty.timestamp > :startTimestamp', { strategyBoxId, startTimestamp })
    .getMany();
  return list.map((v) => v.decode());
};
