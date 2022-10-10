import { er, ok } from "../../../common/error/Result";
import { Vcat2Error } from "../../../common/error/Vcat2Error";
import { ea, Vcat2Result } from "../../../common/error/Vcat2Result";
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
  const amountBuyMarketResult = isMarketBuy(tradeParam) ? calcAmountMarketBuy(pair, tradeParam.amount) : undefined;
  if (amountBuyMarketResult?.isEr) return amountBuyMarketResult; // エラーの場合はそのまま返却。
  // @ts-ignore ts-jestがここをエラーとしてしまい、テストできないための暫定措置。POSTしてみたけど反応なし：https://github.com/kulshekhar/ts-jest/issues/3860
  const amountBuyMarket = amountBuyMarketResult?.ok;
  const result = await CoincheckPostOrder.request({ pair, side, type, rate, amount, amountMarketBuy: amountBuyMarket, stopLossRate });
  return result.handleOk((body) => {
    return {
      id: body.id.toString(),
      amount,
      amountBuyMarket,
    };
  });
});

const calcAmountMarketBuy = (pair: Pair, amount: number): Vcat2Result<number> => {
  const lastPrice = marketCache.getLastHistory(pair)?.price;
  if (lastPrice === undefined) return er(new Vcat2Error(__filename, { message: 'calcAmountMarketBuyでLastPriceが取得できません。' }));
  return ok(lastPrice * amount);
};
