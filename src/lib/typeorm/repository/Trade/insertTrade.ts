import { DR } from "../../../../common/typescript/deepreadonly";
import { Trade } from "../../../../domain/Trade/Trade";
import { Trade as TradeEntity } from "../../entity/Trade.entity";
import { typeormDS } from "../../typeorm";

export const insertTrade = async (trade: DR<Trade>) => {
  await typeormDS.getRepository(TradeEntity).insert(new TradeEntity(trade));
};
