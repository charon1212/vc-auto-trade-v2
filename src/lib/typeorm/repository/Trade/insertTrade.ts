import { DR } from "../../../../common/typescript/deepreadonly";
import { Trade } from "../../../../domain/Trade/Trade";
import { Trade as TradeEntity } from "../../entity/Trade.entity";
import { getTypeormRepository } from "../../typeorm";

export const insertTrade = async (trade: DR<Trade>) => {
  await getTypeormRepository(TradeEntity).insert(new TradeEntity(trade));
};
