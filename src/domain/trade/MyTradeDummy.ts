import { logger } from "../../common/log/logger";
import { apiTicker } from "../../interfaces/coincheck/apiTicker";
import { TradeResult } from "../../typeorm/entity/TradeResult";
import { typeormDS } from "../../typeorm/typeorm";
import { ArgSendMyTrade } from "./MyTrade";

export const sendMyTradeDummy = (arg: ArgSendMyTrade) => {

  const { param, onSuccess, onFail } = arg;
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
        await typeormDS.manager.save(tr);
        if (onSuccess) onSuccess();
      } else {
        if (onFail) onFail();
      }
    } catch (e) {
      if (onFail) onFail();
    }
  };
  setTimeout(exec, 5000); // 5秒後に実行

};
