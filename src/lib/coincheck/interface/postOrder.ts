import { ea } from "../../../common/error/Vcat2Result";
import { DR } from "../../../common/typescript/deepreadonly";
import { Pair, Trade } from "../../../domain/BaseType";
import { marketCache } from "../../../domain/Market/MarketCache";
import { isMarketBuy } from "../../../domain/Trade/isMarketBuy";
import { CoincheckPostOrder } from "../apiTool/CoincheckPostOrder";

export const postOrder = ea(__filename, async (trade: DR<Trade>) => {
  const { pair, tradeParam } = trade;
  const { side, type, stopLossRate } = tradeParam;
  const rate = tradeParam.type === 'limit' ? tradeParam.rate : undefined;
  const amount = isMarketBuy(tradeParam) ? undefined : tradeParam.amount;
  const amountMarketBuy = isMarketBuy(tradeParam) ? calcAmountMarketBuy(pair, tradeParam.amount) : undefined;
  const result = await CoincheckPostOrder.request({ pair, side, type, rate, amount, amountMarketBuy, stopLossRate });
  return result.handleOk((body) => {
    return {
      id: body.id.toString(),
      amount,
      amountBuyMarket: amountMarketBuy,
    };
  });
});

const calcAmountMarketBuy = (pair: Pair, amount: number) => {
  const lastPrice = marketCache.getLastHistory(pair)?.price;
  if (lastPrice === undefined) throw new Error(''); // TODO: エラー処理
  return lastPrice * amount;
};
