import { Trade, TradeStatus } from "../../../../domain/BaseType";
import { Execution as ExecutionEntity } from "../../entity/Execution.entity";
import { Trade as TradeEntity } from "../../entity/Trade.entity";
import { getTypeormRepository } from "../../typeorm";

type FindParam = {
  status?: TradeStatus,
  apiId?: string,
  isForwardTest?: boolean,
};

export const findTrade = async (param?: FindParam): Promise<Trade[]> => {
  const { status, apiId, isForwardTest } = param || {};
  const list = await getTypeormRepository(TradeEntity).find({ where: { status, apiId, isForwardTest } });
  if (list.length === 0) return [];
  const listExecution = await getTypeormRepository(ExecutionEntity)
    .createQueryBuilder('execution')
    .where('execution.uid in (:...uids)', { uids: list.map(({ uid }) => uid) })
    .getMany();
  return list.map((tradeEntity) => {
    const trade = tradeEntity.decode();
    trade.executions = listExecution.filter(({ tradeUid }) => tradeUid === trade.uid).map((executionEntity) => executionEntity.decode());
    return trade;
  });
};
