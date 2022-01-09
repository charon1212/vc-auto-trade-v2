import { logger } from "../../common/log/logger";
import { Pair } from "../../type/coincheck";

export type TradeParams = {
  pair: Pair,
  side: 'buy' | 'sell',
  ammountByUnit: number, // 最小注文量の整数倍で指定
  strategyBoxId: string,
};
export type ArgSendMyTrade = {
  param: TradeParams,
  onSuccess?: () => unknown,
  onFail?: () => unknown,
};

export const sendMyTrade = (arg: ArgSendMyTrade) => {

  logger.info(`trade: ${JSON.stringify(arg.param)}`);
  throw new Error('未実装');

};
