import { Penalty as DomainPenalty } from "../../../../domain/PenaltyCounter/Penalty";
import { Penalty as PenaltyEntity } from "../../entity/Penalty.entity";
import { getTypeormRepository } from "../../typeorm";

export const insertPenalty = (penalty: DomainPenalty) => getTypeormRepository(PenaltyEntity).insert(new PenaltyEntity(penalty));
