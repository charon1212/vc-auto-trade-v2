import { Vcat2Result } from "../../../common/error/Vcat2Result";
import { CoincheckGetCancelStatus } from "../apiTool/CoincheckGetCancelStatus";

export const fetchOrderIsCancel = async (apiId: number): Promise<Vcat2Result<boolean>> => {
  return (await CoincheckGetCancelStatus.request({ id: apiId })).handleOk((response) => response.cancel);
};
