import { executionMonitor } from '../../../../src/domain/Execution/ExecutionMonitor';
import { marketCache } from '../../../../src/domain/Market/MarketCache';
import { tradeManager } from '../../../../src/domain/Trade/TradeManager';
import { getTypeormRepository } from '../../../../src/lib/typeorm/typeorm';
import { createTestStrategyBox } from '../../../testutil/createTestData/createTestStrategyBox';
import { createTestTrade } from '../../../testutil/createTestData/createTestTrade';
import { A_obj } from '../../../testutil/myAssertion/myAssertion';
import { createTestStrategy } from './createTestStrategy';
import { registerTradeCache } from './registerTradeCache';
import { StrategyBox } from '../../../../src/lib/typeorm/entity/StrategyBox.entity';
import { spyCommon } from '../../../spy/common/spyCommon';

describe('StrategyBox.tick', () => {
  it('test1', async () => {
    // prepare - spy common
    spyCommon();
    // prepare - strategy
    const strategy = createTestStrategy('test-strategy-1',
      ({ param, context, priceShortHistory, tradeList }) => {
        expect(param.id).toBe('testParam');
        expect(context.id).toBe('initialContext');
        expect(priceShortHistory.length).toBe(100);
        expect(priceShortHistory[7]).toBe(7); // sampleで8番目をチェック。
        expect(tradeList.length).toBe(0);
      },
      () => ({ context: { id: 'afterContext' }, newTradeList: [], }),
    );

    // prepare - strategy box
    const param = { id: 'testParam' };
    const isForwardTest = false;
    const initialContext = { id: 'initialContext' };
    const { strategyBox } = createTestStrategyBox({ id: 'strategyBox-1', strategy, param, initialContext, isForwardTest });
    const strategyBoxEntity = new StrategyBox();
    strategyBoxEntity.id = 'strategyBox-1';
    strategyBoxEntity.strategyId = 'test-strategy-1';
    strategyBoxEntity.paramJson = '{"id":"testParam"}';
    strategyBoxEntity.contextJson = '{"id":"initialContext"}';
    strategyBoxEntity.pair = 'btc_jpy';
    strategyBoxEntity.isForwardTest = false;
    strategyBoxEntity.delete = false;
    await getTypeormRepository(StrategyBox).save(strategyBoxEntity);

    // prepare - market cache
    (marketCache as any).marketHistoryCacheMap['btc_jpy'] = [...Array(100)].map((_, i) => ({ timestamp: i * 10000, price: i }));
    // prepare - trade cache
    const tradeList = createTestTrade([]);
    registerTradeCache(tradeList);
    // prepare - trade manager
    const spy1 = jest.spyOn(tradeManager, 'checkRequestedTradeHasExecuted').mockReturnValue(Promise.resolve());
    const spy3 = jest.spyOn(tradeManager, 'order');
    // prepare - execution monitor
    const spy2 = jest.spyOn(executionMonitor, 'update').mockReturnValue(Promise.resolve());

    // exec
    await (strategyBox as any).tick();

    // assert
    expect(spy1).not.toBeCalled();
    expect(spy2).not.toBeCalled();
    expect(spy3).not.toBeCalled();
    // assert - db strategy box
    const actualStrategyBoxEntity = await getTypeormRepository(StrategyBox).findOne({ where: { id: 'strategyBox-1' } });
    A_obj(actualStrategyBoxEntity)
      .desc('assert strategy box 1')
      .isNonNullable()
      .toBe(({ contextJson }) => JSON.parse(contextJson).id === 'afterContext');

  });
});
