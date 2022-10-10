import { TradeParam } from "../BaseType";

export const isMarketBuy = (tradeParam: TradeParam) => tradeParam.side === 'buy' && tradeParam.type === 'market';
