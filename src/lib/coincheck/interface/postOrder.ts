import { DR } from "../../../common/typescript/deepreadonly";
import { Pair } from "../../../domain/Exchange/type";
import { marketCache } from "../../../domain/Market/MarketCache";
import { Trade } from "../../../domain/Trade/Trade";
import { CoincheckPostOrder } from "../apiTool/CoincheckPostOrder";

export const postOrder = async (trade: DR<Trade>) => {
  const { pair, tradeParam } = trade;
  const { side, type } = tradeParam;
  const rate = tradeParam.type === 'limit' ? tradeParam.rate : undefined;
  const amount = (tradeParam.type === 'market' && tradeParam.side == 'buy') ? undefined : tradeParam.amount;
  const amountMarketBuy = (tradeParam.type === 'market' && tradeParam.side == 'buy') ? calcAmountMarketBuy(pair, tradeParam.amount) : undefined;
  const result = (await CoincheckPostOrder.request({ pair, side, type, rate, amount, amountMarketBuy }))._();
  return result?.id.toString();
};

const calcAmountMarketBuy = (pair: Pair, amount: number) => {
  const lastPrice = marketCache.getLastHistory(pair)?.price;
  if (lastPrice === undefined) throw new Error(''); // TODO: エラー処理
  return lastPrice * amount;
};
