import { Result } from '../../../src/common/error/Result';
import { CoincheckPostOrder, RequestParamPostOrder } from '../../../src/lib/coincheck/apiTool/CoincheckPostOrder';

export const spyCoincheckPostOrder = (getId: (param: RequestParamPostOrder) => number) => {
  return jest.spyOn(CoincheckPostOrder, 'request').mockImplementation(async (param) => {
    const id = getId(param);
    const { pair, side, type, rate, amount, amountMarketBuy } = param;
    const order_type = (type === 'market' ? 'market_' : '') + side;
    return Result.success({
      success: true,
      id,
      rate: `${rate}`,
      amount: `${amount}`,
      market_buy_amount: `${amountMarketBuy}`,
      order_type: order_type as "buy" | "sell" | "market_buy" | "market_sell",
      pair,
      stop_loss_rate: undefined,
    });
  });
};
