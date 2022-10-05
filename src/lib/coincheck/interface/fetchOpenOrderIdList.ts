import { ea } from "../../../common/error/Vcat2Result";
import { CoincheckGetOpenOrder } from "../apiTool/CoincheckGetOpenOrder";

export const fetchOpenOrderIdList = ea(__filename, async () => {
  const result = await CoincheckGetOpenOrder.request({});
  return result.handleOk((openOrderList) => {
    return openOrderList.orders.map(({ id }) => `${id}`);
  });
});
