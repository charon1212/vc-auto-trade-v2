import { Execution } from "../../../../domain/Execution/Execution";
import { Execution as ExecutionEntity } from "../../entity/Execution.entity";
import { getTypeormRepository } from "../../typeorm";

export const findExecutionByApiIdList = async (apiIdList: string[]): Promise<Execution[]> => {
  const entityList = await getTypeormRepository(ExecutionEntity)
    .createQueryBuilder('execution')
    .where('execution.apiId in (:...apiIdList)', { apiIdList })
    .getMany();
  return entityList.map((e) => e.decode());
};
