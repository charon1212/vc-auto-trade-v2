import { DR } from "../../../../common/typescript/deepreadonly";
import { Execution } from "../../../../domain/Execution/Execution";
import { Execution as ExecutionEntity } from "../../entity/Execution.entity";
import { getTypeormRepository } from "../../typeorm";

export const insertExecution = async (execution: DR<Execution>) => {
  await getTypeormRepository(ExecutionEntity).insert(new ExecutionEntity(execution));
};
