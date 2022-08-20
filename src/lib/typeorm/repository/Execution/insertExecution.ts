import { DR } from "../../../../common/typescript/deepreadonly";
import { Execution } from "../../../../domain2/Execution/Execution";
import { Execution as ExecutionEntity } from "../../entity/Execution.entity";
import { typeormDS } from "../../typeorm";

export const insertExecution = async (execution: DR<Execution>) => {
  await typeormDS.getRepository(ExecutionEntity).insert(new ExecutionEntity(execution));
};
