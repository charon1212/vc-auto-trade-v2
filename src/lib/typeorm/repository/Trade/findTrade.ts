import { Trade, TradeStatus } from "../../../../domain2/Trade/Trade";
import { Execution as ExecutionEntity } from "../../entity/Execution.entity";
import { Trade as TradeEntity } from "../../entity/Trade.entity";
import { typeormDS } from "../../typeorm";

type FindParam = {
  status?: TradeStatus,
  apiId?: string,
};

export const findTrade = async (param?: FindParam): Promise<Trade[]> => {
  const { status, apiId } = param || {};
  const list = await typeormDS.getRepository(TradeEntity).find({ where: { status, apiId } });
  if (list.length === 0) return [];
  const listExecution = await typeormDS
    .getRepository(ExecutionEntity)
    .createQueryBuilder('execution')
    .where('execution.uid in (:...uids)', { uids: list.map(({ uid }) => uid) })
    .getMany();
  return list.map((tradeEntity) => {
    const trade = tradeEntity.decode();
    trade.executions = listExecution.filter(({ tradeUid }) => tradeUid === trade.uid).map((executionEntity) => executionEntity.decode());
    return trade;
  });
};