import { executionMonitor } from '../../../../src/domain/Execution/ExecutionMonitor';
import { tradeManager } from '../../../../src/domain/Trade/TradeManager';
import { spyCoincheckGetTransactions } from '../../../spy/coincheck/spyCoincheckGetTransactions';
import { makeTestDate } from '../../../testutil/makeTestDate';
import { clearDbData } from '../../../testutil/clearDbData';
import { Execution } from '../../../../src/lib/typeorm/entity/Execution.entity';
import { Trade } from '../../../../src/lib/typeorm/entity/Trade.entity';
import { createTestTrade } from '../../../testutil/createTestData/createTestTrade';
import { createTestExecution } from '../../../testutil/createTestData/createTestExecution';
import { getTypeormRepository } from '../../../../src/lib/typeorm/typeorm';
import { A_obj } from '../../../testutil/myAssertion/myAssertion';

describe('executionMonitor', () => {
  it('test1', async () => {
    // setup
    await clearDbData(Execution, Trade);
    const trade1Execution = createTestExecution([]);
    const trade2Execution = createTestExecution([
      { apiId: '20003', amount: 33, rate: 99993, tradeUid: 'trade-2' },
    ]);
    const trades = createTestTrade([
      { uid: 'trade-1', apiId: '10001', status: 'requested', tradeParam: { side: 'buy', type: 'market', amount: 10 }, executions: trade1Execution },
      { uid: 'trade-2', apiId: '10002', status: 'requested', tradeParam: { side: 'sell', type: 'limit', amount: 20, rate: 100 }, executions: trade2Execution },
    ], 100);
    const spy = jest.spyOn(tradeManager, 'getCache').mockReturnValue(trades);
    const spy2 = jest.spyOn(tradeManager, 'setExecution');
    const { date: date1 } = makeTestDate(1);
    const { date: date2 } = makeTestDate(2);
    const { date: date3 } = makeTestDate(3);
    const { date: date4 } = makeTestDate(4);
    const spy3 = spyCoincheckGetTransactions(true, [
      { id: 20001, order_id: 10001, pair: 'btc_jpy', funds: { btc: '31', jpy: '-31' }, rate: '99991', created_at: date1.toISOString(), },
      { id: 20002, order_id: 10001, pair: 'btc_jpy', funds: { btc: '32', jpy: '-32' }, rate: '99992', created_at: date2.toISOString(), },
      { id: 20003, order_id: 10002, pair: 'btc_jpy', funds: { btc: '-33', jpy: '33' }, rate: '99993', created_at: date3.toISOString(), },
      { id: 20004, order_id: 10002, pair: 'btc_jpy', funds: { btc: '-34', jpy: '34' }, rate: '99994', created_at: date4.toISOString(), },
    ]);

    // exec
    await executionMonitor.update();

    // assert
    expect(spy2.mock.calls.length).toBe(3);

    const executions = await getTypeormRepository(Execution).find({});
    expect(executions.length).toBe(3);
    A_obj(executions.find(({ apiId }) => apiId === '20001'))
      .desc('assert execution 1')
      .isNonNullable()
      .toBe(({ amount, rate, tradeUid, createdAtMs }) =>
        amount === 31 &&
        rate === 99991 &&
        tradeUid === 'trade-1' &&
        createdAtMs === `${date1.getTime()}`
      );
    A_obj(executions.find(({ apiId }) => apiId === '20002'))
      .desc('assert execution 2')
      .isNonNullable()
      .toBe(({ amount, rate, tradeUid, createdAtMs }) =>
        amount === 32 &&
        rate === 99992 &&
        tradeUid === 'trade-1' &&
        createdAtMs === `${date2.getTime()}`
      );
    A_obj(executions.find(({ apiId }) => apiId === '20004'))
      .desc('assert execution 3')
      .isNonNullable()
      .toBe(({ amount, rate, tradeUid, createdAtMs }) =>
        amount === 34 &&
        rate === 99994 &&
        tradeUid === 'trade-2' &&
        createdAtMs === `${date4.getTime()}`
      );
  });
});
