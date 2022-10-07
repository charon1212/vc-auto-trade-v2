import { Vcat2Result } from "../../../common/error/Vcat2Result";
import { Trade } from "../../../domain/BaseType";
import { DR } from "../../../strategy/bridge";
import { CoincheckDeleteOrder } from "../apiTool/CoincheckDeleteOrder";

export const cancelOrder = async (trade: DR<Trade>): Promise<Vcat2Result<void>> => {
  const result = await CoincheckDeleteOrder.request({ orderId: +trade.apiId });
  return result.handleOk(() => { });
};
