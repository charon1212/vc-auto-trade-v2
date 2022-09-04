import { DR } from "../../../../common/typescript/deepreadonly";
import { Market as DomainMarket } from "../../../../domain/Market/Market";
import { Market as MarketEntity } from "../../entity/Market.entity";
import { typeormDS } from "../../typeorm";

export const insertMarket = async (market: DR<DomainMarket>) => {
  await typeormDS.getRepository(MarketEntity).insert(new MarketEntity(market));
};
