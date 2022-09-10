import { Trade } from "../../entity/Trade.entity";
import { getTypeormRepository } from "../../typeorm";

export const getTradeIdMap = async (apiIdList: string[]): Promise<{ uid: string, apiId: string }[]> => {
  const tradeEntityList = await getTypeormRepository(Trade)
    .createQueryBuilder('trade')
    .where('trade.apiId in (:...apiIdList)', { apiIdList })
    .getMany();
  return tradeEntityList.map(({ uid, apiId }) => ({ uid, apiId }));
};
