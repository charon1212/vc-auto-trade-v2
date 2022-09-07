import { DR } from "../../../../common/typescript/deepreadonly";
import { Pair } from "../../../../domain/Exchange/type";
import { Market as DomainMarket } from "../../../../domain/Market/Market";
import { Market as MarketEntity } from "../../entity/Market.entity";
import { typeormDS } from "../../typeorm";

export const insertMarket = async (pair: Pair, market: DR<DomainMarket>) => {
  await typeormDS.getRepository(MarketEntity).insert(new MarketEntity(pair, market));
};
