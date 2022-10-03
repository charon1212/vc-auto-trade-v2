import { CoincheckGetOpenOrder } from "../apiTool/CoincheckGetOpenOrder";

export const fetchOpenOrderIdList = async () => {
  const result = await CoincheckGetOpenOrder.request({});
  return result.handleOk((openOrderList) => {
    return openOrderList.orders.map(({ id }) => `${id}`);
  });
};
