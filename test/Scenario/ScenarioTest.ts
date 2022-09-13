import { StrategyBox } from '../../src/domain/StrategyBox/StrategyBox';
import { marketMonitor } from '../../src/domain/Market/MarketMonitor';
import { Pair } from "../../src/domain/Exchange/type";
import { DummyCoincheck } from './DummyCoincheck';
import { Execution as ExecutionEntity } from '../../src/lib/typeorm/entity/Execution.entity';
import { Market as MarketEntity } from '../../src/lib/typeorm/entity/Market.entity';
import { StrategyBox as StrategyBoxEntity } from '../../src/lib/typeorm/entity/StrategyBox.entity';
import { Trade as TradeEntity } from '../../src/lib/typeorm/entity/Trade.entity';
import { getTypeormRepository } from '../../src/lib/typeorm/typeorm';
import { A_obj, fail } from '../testutil/myAssertion/myAssertion';
import { FindOptionsWhere } from 'typeorm';
import { RequestParamPostOrder } from '../../src/lib/coincheck/apiTool/CoincheckPostOrder';
import { spyCommon } from '../spy/common/spyCommon';
import { clearDbData } from '../testutil/clearDbData';

export class ScenarioTest {
  public dummyCoincheck: DummyCoincheck;
  constructor(
    public initialTime: number = 0,
    public tickSpan: number = 10000,
    public strategyBoxList: StrategyBox<any, any>[],
    public price: (pair: Pair, time: number) => number,
    public pairList: Pair[],
  ) {
    this.dummyCoincheck = new DummyCoincheck(price, initialTime);
    pairList.forEach((pair) => marketMonitor.addPair(pair));
    spyCommon();
  };
  async setup() {
    await clearDbData(ExecutionEntity, MarketEntity, StrategyBoxEntity, TradeEntity);
  }
  private getTime(index: number) {
    return this.initialTime + this.tickSpan * index;
  };
  async tickMarketMonitor(index: number) {
    const t = this.getTime(index);
    jest.spyOn(Date, 'now').mockReturnValue(t);
    this.dummyCoincheck.spent(t);
    await (marketMonitor as any).scheduleAddMarket();
  };
  async tickStrategyBox(index: number, id: string) {
    const t = this.getTime(index);
    jest.spyOn(Date, 'now').mockReturnValue(t);
    this.dummyCoincheck.spent(t);
    this.dummyCoincheck.clearCallHistory();
    const strategyBox = this.strategyBoxList.find(({ strategyBoxId }) => strategyBoxId === id);
    if (!strategyBox) throw new Error('StrategyBoxが見つかりません。');
    await (strategyBox as any).tick();
  }
  async assertDbExecution(message: string, where: FindOptionsWhere<ExecutionEntity>, expect: Partial<ExecutionEntity>) {
    const actualExecution = await getTypeormRepository(ExecutionEntity).findOne({ where });
    assertDbObj(`[${message}] expect:[${JSON.stringify(expect)}], actual:[${JSON.stringify(actualExecution)}]`, expect, actualExecution);
    return actualExecution;
  };
  async assertDbMarket(message: string, where: FindOptionsWhere<MarketEntity>, expect: Partial<MarketEntity>) {
    const actualMarket = await getTypeormRepository(MarketEntity).findOne({ where });
    assertDbObj(`[${message}] expect:[${JSON.stringify(expect)}], actual:[${JSON.stringify(actualMarket)}]`, expect, actualMarket);
    return actualMarket;
  };
  async assertDbStrategyBox(message: string, where: FindOptionsWhere<StrategyBoxEntity>, expect: Partial<StrategyBoxEntity>) {
    const actualStrategyBox = await getTypeormRepository(StrategyBoxEntity).findOne({ where });
    assertDbObj(`[${message}] expect:[${JSON.stringify(expect)}], actual:[${JSON.stringify(actualStrategyBox)}]`, expect, actualStrategyBox);
    return actualStrategyBox;
  };
  async assertDbTrade(message: string, where: FindOptionsWhere<TradeEntity>, expect: Partial<TradeEntity>) {
    const actualTrade = await getTypeormRepository(TradeEntity).findOne({ where });
    assertDbObj(`[${message}] expect:[${JSON.stringify(expect)}], actual:[${JSON.stringify(actualTrade)}]`, expect, actualTrade);
    return actualTrade;
  };
  assertOrder(expectOrders: RequestParamPostOrder[]) {
    const actualOrders = this.dummyCoincheck.getPostOrderCallHistory();
    expect(actualOrders.length).toBe(expectOrders.length);
    expectOrders.forEach((exp) => {
      if (!actualOrders.some((act) => {
        for (let k in exp) if (exp[k] !== act[k]) return false;
        return true;
      })) fail(`期待値(${JSON.stringify(exp)})に一致する注文がありません。actual = 「${JSON.stringify(actualOrders)}」`);
    });
  };
};

const assertDbObj = <T extends object>(message: string, expect: Partial<T>, actual: T | null | undefined) => {
  A_obj(actual)
    .desc(message)
    .isNonNullable()
    .toBe((act) => {
      for (let key in act) {
        if (expect[key] !== undefined && expect[key] !== act[key]) return false;
      }
      return true;
    });
};
