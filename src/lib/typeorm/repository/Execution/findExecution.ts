import { Execution } from "../../../../domain2/Execution/Execution";
import { Execution as ExecutionEntity } from "../../entity/Execution.entity";
import { typeormDS } from "../../typeorm";

export const findExecutionByApiIdList = async (apiIdList: string[]): Promise<Execution[]> => {
  const entityList = await typeormDS
    .getRepository(ExecutionEntity)
    .createQueryBuilder('execution')
    .where('execution.apiId in (:...apiIdList)', { apiIdList })
    .getMany();
  return entityList.map((e) => e.decode());
};
