import { Execution } from "../../../src/domain/Execution/Execution";

const defaultExecution = (id: number): Execution => ({
  uid: `uid-${id}`,
  apiId: `${id}`,
  tradeUid: `${id}`,
  pair: 'btc_jpy',
  rate: 1,
  amount: 1,
  createdAtMs: 1,
});
export const createTestExecution = (executions: Partial<Execution>[], idBase: number = 0): Execution[] => {
  return executions.map((execution, i) => ({ ...defaultExecution(idBase + i), ...execution }));
};
