import { DR } from "../../../common/typescript/deepreadonly";
import { Pair } from "../../../domain/Exchange/type";
import { marketInfoCacheMap } from "../../../domain/Market/MarketInfoCache";
import { Trade } from "../../../domain/Trade/Trade";
import { CoincheckPostOrder } from "../apiTool/CoincheckPostOrder";

export const postOrder = async (trade: DR<Trade>) => {
  const { pair, tradeParam } = trade;
  if (tradeParam.type === 'limit') {
    const { amount, rate, side, type } = tradeParam;
    const result = await CoincheckPostOrder.request({ pair, amount, rate, side, type, });
    return result?.id.toString();
  } else if (tradeParam.type === 'market') {
    const { amount, side, type } = tradeParam;
    if (side === 'buy') {
      const amountMarketBuy = calcAmountMarketBuy(pair, amount);
      const result = await CoincheckPostOrder.request({ pair, side, type, amountMarketBuy });
      return result?.id.toString();
    } else if (side === 'sell') {
      const result = await CoincheckPostOrder.request({ pair, side, type, amount });
      return result?.id.toString();
    }
  }
};

const calcAmountMarketBuy = (pair: Pair, amount: number) => {
  const lastPrice = marketInfoCacheMap[pair]?.getLastPrice();
  if (lastPrice === undefined) throw new Error(''); // TODO: エラー処理
  return lastPrice * amount;
};
