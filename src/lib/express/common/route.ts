import { getTest } from "../resource/test/getTest";
import { getOpenOrder } from "../resource/vcat2/v2/executeApi/openOrder/getOpenOrder";
import { postOrder } from "../resource/vcat2/v2/executeApi/order/postOrder";
import { getTransaction } from "../resource/vcat2/v2/executeApi/transaction/getTransaction";

export const route = () => {

  // GET:/vcat2/v2/execute-api/open-order
  getOpenOrder();
  // GET:/vcat2/v2/execute-api/transaction
  getTransaction();
  // POST:/vcat2/v2/execute-api/order
  postOrder();

  // GET:/test
  getTest();

};
