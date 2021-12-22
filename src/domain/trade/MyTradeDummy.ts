import { logger } from "../../common/log/logger";
import { apiTicker } from "../../interfaces/coincheck/apiTicker";
import { Pair } from "../../type/coincheck";
import { TradeResult } from "../../typeorm/entity/TradeResult";
import { getConnection } from "../../typeorm/typeorm";

export type TradeParams = {
  pair: Pair,
  side: 'buy' | 'sell',
  ammountByUnit: number, // 最小注文量の整数倍で指定
  strategyBoxId: string,
};

export const sendMyTradeDummy = (param: TradeParams, onSuccess: () => unknown, onFail: () => unknown) => {

  logger.info(`dummy-trade: ${JSON.stringify({ param })}`);
  const orderTimestamp = Date.now().toString();
  const { pair, side, ammountByUnit, strategyBoxId } = param;
  const amount = ammountByUnit * 0.0005;
  const exec = async () => {
    try {
      const ticker = await apiTicker(pair);
      if (ticker) {
        const rate = side === 'buy' ? ticker.ask : ticker.bid;
        const tr = new TradeResult({ type: 'market', side, amount, rate, orderTimestamp, isDummy: true, strategyBoxId });
        await getConnection().manager.save(tr);
        onSuccess();
      } else {
        onFail();
      }
    } catch (e) {
      onFail();
    }
  };
  setTimeout(exec, 5000); // 5秒後に実行

};
