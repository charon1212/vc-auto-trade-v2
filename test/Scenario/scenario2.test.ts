import { createTestStrategyBox } from "../testutil/createTestData/createTestStrategyBox";
import { price1 } from "./PriceCalculator/price1";
import { strategy1 } from "./ScenarioStrategy/strategy1";
import { ScenarioTest } from "./ScenarioTest";

/**
 * シナリオ2
 * Price: 標準的な三角波の価格
 * Strategy: 指定値段での成行売買
 * StrategyBox: ForwardTest
 */
describe('scenario2', () => {
  it('scenario2', async () => {
    const { strategyBox: sb1 } = createTestStrategyBox({
      id: 'test-strategy-box-1',
      strategy: strategy1,
      initialContext: { side: 'buy' },
      param: { buy: 200, sell: 300, amount: 10 },
      isForwardTest: true,
    });
    const price = price1(100, 350, 100 * 1000); // 100秒かけて100円～350円を行ったり来たりする。1秒ごとの変化量は5円。
    const scenarioTest = new ScenarioTest(0, 10000, [sb1], (_, t) => price(t), ['btc_jpy']);
    await scenarioTest.setup();

    await scenarioTest.tickMarketPolling(1); // 10000ms - 150円
    await scenarioTest.tickStrategyBox(1, 'test-strategy-box-1'); // 150円で購入する。
    await scenarioTest.assertOrder([]);
    const trade1 = await scenarioTest.assertDbTrade('Trade[1]',
      { strategyBoxId: 'test-strategy-box-1', orderAtMs: '10000' },
      { pair: 'btc_jpy', amount: 10, side: 'buy', status: 'executed', strategyId: 'test-strategy-1', type: 'market', isForwardTest: true, lastUpdateStatusMs: '10000', },
    );
    await scenarioTest.assertDbExecution('Execution[1]', { tradeUid: trade1!.uid }, { amount: 10, rate: 150, pair: 'btc_jpy', });

    await scenarioTest.tickMarketPolling(2); // 20000ms - 200円
    await scenarioTest.tickStrategyBox(2, 'test-strategy-box-1');
    await scenarioTest.assertOrder([]);

    await scenarioTest.tickMarketPolling(3); // 30000ms - 250円
    await scenarioTest.tickStrategyBox(3, 'test-strategy-box-1');
    await scenarioTest.assertOrder([]);

    await scenarioTest.tickMarketPolling(4); // 40000ms - 300円
    await scenarioTest.tickStrategyBox(4, 'test-strategy-box-1');
    await scenarioTest.assertOrder([]);
    const trade2 = await scenarioTest.assertDbTrade('Trade[2]',
      { strategyBoxId: 'test-strategy-box-1', orderAtMs: '40000' },
      { pair: 'btc_jpy', amount: 10, side: 'sell', status: 'executed', strategyId: 'test-strategy-1', type: 'market', isForwardTest: true, lastUpdateStatusMs: '40000', },
    );
    await scenarioTest.assertDbExecution('Execution[2]', { tradeUid: trade2!.uid }, { amount: 10, rate: 300, pair: 'btc_jpy', });

    await scenarioTest.tickMarketPolling(5); // 50000ms - 350円
    await scenarioTest.tickStrategyBox(5, 'test-strategy-box-1');
    await scenarioTest.assertOrder([]);

    await scenarioTest.tickMarketPolling(6); // 60000ms - 300円
    await scenarioTest.tickStrategyBox(6, 'test-strategy-box-1');
    await scenarioTest.assertOrder([]);

    await scenarioTest.tickMarketPolling(7); // 70000ms - 250円
    await scenarioTest.tickStrategyBox(7, 'test-strategy-box-1');
    await scenarioTest.assertOrder([]);

    await scenarioTest.tickMarketPolling(8); // 80000ms - 200円
    await scenarioTest.tickStrategyBox(8, 'test-strategy-box-1');
    await scenarioTest.assertOrder([]);
    const trade3 = await scenarioTest.assertDbTrade('Trade[3]',
      { strategyBoxId: 'test-strategy-box-1', orderAtMs: '80000' },
      { pair: 'btc_jpy', amount: 10, side: 'buy', status: 'executed', strategyId: 'test-strategy-1', type: 'market', isForwardTest: true, lastUpdateStatusMs: '80000', },
    );
    await scenarioTest.assertDbExecution('Execution[3]', { tradeUid: trade3!.uid }, { amount: 10, rate: 200, pair: 'btc_jpy', });

    await scenarioTest.tickMarketPolling(9); // 90000ms - 150円
    await scenarioTest.tickStrategyBox(9, 'test-strategy-box-1');
    await scenarioTest.assertOrder([]);

    await scenarioTest.tickMarketPolling(10); //100000ms -  100円
    await scenarioTest.tickStrategyBox(10, 'test-strategy-box-1');
    await scenarioTest.assertOrder([]);

    // DB assertion
    await scenarioTest.assertDbMarket('Market[1]', { pair: 'btc_jpy', timestamp: '10000', }, { price: 150 });
    await scenarioTest.assertDbMarket('Market[2]', { pair: 'btc_jpy', timestamp: '20000', }, { price: 200 });
    await scenarioTest.assertDbMarket('Market[3]', { pair: 'btc_jpy', timestamp: '30000', }, { price: 250 });
    await scenarioTest.assertDbMarket('Market[4]', { pair: 'btc_jpy', timestamp: '40000', }, { price: 300 });
    await scenarioTest.assertDbMarket('Market[5]', { pair: 'btc_jpy', timestamp: '50000', }, { price: 350 });
    await scenarioTest.assertDbMarket('Market[6]', { pair: 'btc_jpy', timestamp: '60000', }, { price: 300 });
    await scenarioTest.assertDbMarket('Market[7]', { pair: 'btc_jpy', timestamp: '70000', }, { price: 250 });
    await scenarioTest.assertDbMarket('Market[8]', { pair: 'btc_jpy', timestamp: '80000', }, { price: 200 });
    await scenarioTest.assertDbMarket('Market[9]', { pair: 'btc_jpy', timestamp: '90000', }, { price: 150 });
    await scenarioTest.assertDbMarket('Market[10]', { pair: 'btc_jpy', timestamp: '100000', }, { price: 100 });

  });
});
