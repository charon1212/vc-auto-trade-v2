import { Pair } from "../../../../domain/Exchange/type";
import { Market as DomainMarket } from "../../../../domain/Market/Market";
import { Market as MarketEntity } from "../../entity/Market.entity";
import { getTypeormRepository } from "../../typeorm";

type FindParam = {
  pair: Pair,
  startTimestamp?: number,
  lastTimestamp?: number,
  limit: number,
};

export const findMarket = async (param: FindParam): Promise<DomainMarket[]> => {
  const { pair, startTimestamp, lastTimestamp, limit } = param;
  const queryList = [] as string[];
  queryList.push('(market.pair = :pair)');
  if (startTimestamp) queryList.push('(timestamp >= :starttimestamp)');
  if (lastTimestamp) queryList.push('(timestamp < :lasttimestamp)');
  const whereQuery = queryList.join(' AND ');

  const result = await getTypeormRepository(MarketEntity)
    .createQueryBuilder('market')
    .where(whereQuery, { pair, starttimestamp: startTimestamp, lasttimestamp: lastTimestamp })
    .limit(limit)
    .getMany();
  return result.map(({ timestamp, price }) => ({ timestamp: +timestamp, price }));
};
