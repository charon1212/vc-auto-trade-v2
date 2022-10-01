import { getTest } from "../resource/test/getTest";
import { getGetBalance } from "../resource/vcat2/v2/executeApi/balance/getBalance";
import { getOpenOrder } from "../resource/vcat2/v2/executeApi/openOrder/getOpenOrder";
import { deleteOrder } from "../resource/vcat2/v2/executeApi/order/deleteOrder";
import { postOrder } from "../resource/vcat2/v2/executeApi/order/postOrder";
import { getTransaction } from "../resource/vcat2/v2/executeApi/transaction/getTransaction";
import { getPriceHistory } from "../resource/vcat2/v2/priceHistory/getPriceHistory";

export const route = () => {

  // GET:/vcat2/v2/execute-api/balance
  getGetBalance();
  // GET:/vcat2/v2/execute-api/open-order
  getOpenOrder();
  // GET:/vcat2/v2/execute-api/transaction
  getTransaction();
  // DELETE:/vcat2/v2/execute-api/order
  deleteOrder();
  // POST:/vcat2/v2/execute-api/order
  postOrder();

  // GET:/vcat2/v2/price-history
  getPriceHistory();

  // GET:/test
  getTest();

};
