import { Trade } from "../../../../src/domain/Trade/Trade";
import { tradeManager } from "../../../../src/domain/Trade/TradeManager";

export const registerTradeCache = (tradeList: Trade[]) => {
  (tradeManager as any).tradeCache.cacheAll = tradeList;
  (tradeManager as any).tradeCache.cache['requesting'] = tradeList.filter(({ status }) => status === 'requesting');
  (tradeManager as any).tradeCache.cache['requested'] = tradeList.filter(({ status }) => status === 'requested');
  (tradeManager as any).tradeCache.cache['executed'] = tradeList.filter(({ status }) => status === 'executed');
  (tradeManager as any).tradeCache.cache['cancel'] = tradeList.filter(({ status }) => status === 'cancel');
};
