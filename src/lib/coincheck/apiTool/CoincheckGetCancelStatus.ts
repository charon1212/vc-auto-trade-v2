import { CoincheckApiTool } from "./CoincheckApiTool";

export type RequestParamGetCancelStatus = { id: number };
export type ResponseBodyGetCancelStatus = {
  success: boolean,
  id: number,
  cancel: boolean,
  created_at: string,
};

export const CoincheckGetCancelStatus = new CoincheckApiTool<RequestParamGetCancelStatus, ResponseBodyGetCancelStatus>({
  isPrivate: false,
  method: 'GET',
  createRequest: ({ id }) => ({
    uri: `/api/exchange/orders/cancel_status?id=${id}`,
  }),
});
