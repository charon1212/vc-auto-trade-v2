import { app } from "./app";
import { addGetPriceHistory } from "./priceHistory/getPriceHistory";
import { getTest } from "./resource/test/getTest";
import { addGetTradeResult } from "./tradeResult/getTradeResult";

export const route = () => {

  // GET:/vcat2/v1/pair/:pair/price-history
  addGetPriceHistory(app);
  // GET:/vcat2/v1/trade-result
  addGetTradeResult(app);

  // GET:/test
  getTest();

};
