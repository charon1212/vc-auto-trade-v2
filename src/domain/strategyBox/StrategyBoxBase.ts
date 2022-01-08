import { logger } from "../../common/log/logger";
import { Pair } from "../../type/coincheck";
import { PriceManager } from "../price/PriceManager";
import * as fs from 'fs';

/**
 * StrategyBoxのモード
 * - running: 正常稼働中。
 * - error: エラーが起きたためリカバリー中。リカバリーが完了するまで待機する。
 * - sleep: 停止中。
 */
export type StrategyBoxMode = 'running' | 'error' | 'sleep';

/**
 * 1つの戦略に従ってトレードを行う単位(StrategyBox)の基底クラス。
 *
 * @param ContextType コンテキストのデータ型。コンテキストは、トレード中に記憶したい情報。例えば、直近の売り/買いを記憶して、次の取引をその逆にする場合、売り/買いの情報を覚える必要がある。
 */
export abstract class StrategyBoxBase<ContextType extends Object> {

  /** 最後に実行したタイムスタンプ */
  public lastExecutionTime: number = -1;
  /** 実行状態 */
  public mode: StrategyBoxMode = 'sleep';

  /** 通貨ペア */
  public readonly pair: Pair;
  /** 価格マネージャー */
  public readonly priceManager: PriceManager;
  /** 実行間隔 */
  public readonly tickSpanMilliseconds: number = 10000;
  /** 戦略ID */
  public id: string;

  /** コンストラクタ */
  constructor(id: string, pair: Pair, priceManager: PriceManager, contextInit: ContextType) {
    this.id = id;
    this.pair = pair;
    this.priceManager = priceManager;
    this.context = contextInit;
    fs.mkdirSync(this.getContextDirPath(), { recursive: true });
  }

  /**
   * StrategyBoxを開始する。
   */
  start(): void {
    this.mode = 'running';
    this.tickBase();
  };

  /**
   * 定期実行処理。基本はthis.tickSpanMillisecondsで指定したミリ秒ごとに、tick関数を実行する。
   */
  tickBase(): void {
    try {
      if (this.mode !== 'running') return;
      this.lastExecutionTime = Date.now();
      this.tick(() => {
        logger.debug('set next');
        setTimeout(() => { this.tickBase() }, this.tickSpanMilliseconds);
      });
    } catch (e) {
      this.mode = 'error';
    }
  }
  // 定期実行処理
  protected abstract tick(next: () => unknown): unknown;

  /** コンテキスト */
  protected context: ContextType;
  protected abstract isContextType: (arg: any) => arg is ContextType;
  // コンテキストを設定する。
  protected setContext(setter: ContextType | ((before: ContextType) => ContextType)): void {
    const newContext = (typeof setter === 'function') ? setter(this.context) : setter;
    const contextFilePath = this.getContextFilePath();
    this.context = newContext;
    fs.writeFileSync(contextFilePath, JSON.stringify(newContext));
  }
  // コンテキスト保存ファイルの存在を確認し、存在すればコンテキストを読み込む。
  public loadContextFromFile(): boolean {
    const path = this.getContextFilePath();
    if (!fs.existsSync(path)) return false;
    const json = fs.readFileSync(this.getContextFilePath()).toString();
    const context = JSON.parse(json);
    if (!this.isContextType(context)) return false;
    this.context = context;
    return true;
  }
  private getContextDirPath = () => `files/StrategyBox/${this.id}`;
  private getContextFilePath = () => `${this.getContextDirPath()}/context.json`;

};
