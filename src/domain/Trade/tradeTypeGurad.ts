import { Trade, TradeType } from "../BaseType";

export const tradeTypeGuard = <T extends TradeType>(trade: Trade, type: T): trade is Trade<T> => trade.tradeParam.type === type;
