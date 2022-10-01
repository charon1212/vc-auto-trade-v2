import { Currency } from "../../../domain/Exchange/type";
import { CoincheckApiTool } from "./CoincheckApiTool";

export type RequestParamGetBalance = {};
export type ResponseBodyGetBalance = { [key in 'success' | BalanceKey]: key extends 'success' ? boolean : string };
type BalanceKey = `${Currency}${'' | '_reserved' | '_lend_in_use' | '_lent' | '_debt'}`;

export const CoincheckGetBalance = new CoincheckApiTool<RequestParamGetBalance, ResponseBodyGetBalance>({
  isPrivate: true,
  method: 'GET',
  createRequest: () => ({
    uri: `/api/accounts/balance`,
  }),
});
