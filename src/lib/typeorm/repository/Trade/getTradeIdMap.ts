import { Trade } from "../../entity/Trade.entity";
import { typeormDS } from "../../typeorm";

export const getTradeIdMap = async (apiIdList: string[]): Promise<{ uid: string, apiId: string }[]> => {
  const tradeEntityList = await typeormDS
    .getRepository(Trade)
    .createQueryBuilder('trade')
    .where('trade.apiId in (:...apiIdList)', { apiIdList })
    .getMany();
  return tradeEntityList.map(({ uid, apiId }) => ({ uid, apiId }));
};
