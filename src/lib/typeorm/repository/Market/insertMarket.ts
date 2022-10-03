import { DR } from "../../../../common/typescript/deepreadonly";
import { Market as DomainMarket, Pair } from "../../../../domain/BaseType";
import { Market as MarketEntity } from "../../entity/Market.entity";
import { getTypeormRepository } from "../../typeorm";

export const insertMarket = async (pair: Pair, market: DR<DomainMarket>) => {
  await getTypeormRepository(MarketEntity).insert(new MarketEntity(pair, market));
};
