import { DR } from "../../../../common/typescript/deepreadonly";
import { Trade } from "../../../../domain/Trade/Trade";
import { Trade as TradeEntity } from "../../entity/Trade.entity";
import { getTypeormRepository } from "../../typeorm";

export const updateTrade = async (trade: DR<Trade>) => {
  const rep = getTypeormRepository(TradeEntity);
  const tradeEntity = await rep.findOne({ where: { uid: trade.uid } });
  if (!tradeEntity) return;
  tradeEntity.strategyId = trade.strategyId;
  tradeEntity.strategyBoxId = trade.strategyBoxId;
  tradeEntity.apiId = trade.apiId;
  tradeEntity.pair = trade.pair;
  tradeEntity.status = trade.status;
  tradeEntity.lastUpdateStatusMs = `${trade.lastUpdateStatusMs}`;
  tradeEntity.side = trade.tradeParam.side;
  tradeEntity.amount = trade.tradeParam.amount;
  tradeEntity.type = trade.tradeParam.type;
  tradeEntity.rate = trade.tradeParam.type === 'limit' ? trade.tradeParam.rate : null;
  await rep.save(tradeEntity);
  return trade;
};
