import { Pair } from "../../type/coincheck";
import { PriceManager } from "../price/PriceManager";

/**
 * StrategyBoxのモード
 * - running: 正常稼働中。
 * - error: エラーが起きたためリカバリー中。リカバリーが完了するまで待機する。
 * - sleep: 停止中。
 */
export type StrategyBoxMode = 'running' | 'error' | 'sleep';

export abstract class StrategyBoxBase {

  /** 最後に実行したタイムスタンプ */
  public lastExecutionTime: number = -1;
  public mode: StrategyBoxMode = 'sleep';
  public readonly pair: Pair;
  public readonly priceManager: PriceManager;
  public readonly tickSpanMilliseconds: number = 5000;
  constructor(pair: Pair, priceManager: PriceManager) {
    this.pair = pair;
    this.priceManager = priceManager;
  }

  /**
   * StrategyBoxを開始する。
   */
  start(): void {
    this.mode = 'running';
    this.tickBase();
  };

  tickBase(): void {
    try {
      if (this.mode !== 'running') return;
      this.lastExecutionTime = Date.now();
      this.tick(() => { setTimeout(this.tickBase, 3000); });
    } catch (e) {
      this.mode = 'error';
    }
  }

  protected abstract tick(next: () => unknown): unknown;

};
