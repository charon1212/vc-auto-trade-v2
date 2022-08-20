import { CoincheckGetOpenOrder } from "../apiTool/CoincheckGetOpenOrder";

export const fetchOpenOrderIdList = async () => {
  const openOrderList = await CoincheckGetOpenOrder.request({});
  return openOrderList && openOrderList.orders.map(({ id }) => `${id}`);
};
