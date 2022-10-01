import { CoincheckApiTool } from "./CoincheckApiTool";

export type RequestParamDeleteOrder = { orderId: number };
export type ResponseBodyDeleteOrder = { success: boolean, id: number, };

export const CoincheckDeleteOrder = new CoincheckApiTool<RequestParamDeleteOrder, ResponseBodyDeleteOrder>({
  isPrivate: true,
  method: 'DELETE',
  createRequest: ({ orderId }) => ({
    uri: `/api/exchange/orders/${orderId}`,
  }),
});
