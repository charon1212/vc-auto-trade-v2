import { websocketTradeStart } from "../../interfaces/coincheck/wsTrade";
import { Pair } from "../../type/coincheck";
import * as cron from 'node-cron';
import { PriceHistory as PriceHistoryOrm } from '../../typeorm/entity/PriceHistory'
import { connected, getConnection, resetConnection } from "../../typeorm/typeorm";

export type PriceHistory = { timestamp: number, price: number };
/**
 * 市場の取引状況を監視し、過去の価格履歴や最新価格を提供する。
 */
export class PriceManager {

  // 最新価格
  public current: { id: number, price: number } | undefined;
  // 10秒ごとの価格リスト
  public shortHistory: PriceHistory[] = [];
  /**
   * @param pair 取引ペア
   */
  constructor(protected pair: Pair) { }

  /**
   * 市場の取引状況監視を始める。
   */
  start() {
    // WebSocketで接続して、最新の取引価格をcurrentに反映する。
    websocketTradeStart({
      pair: this.pair, received: (data) => {
        if (this.current?.id !== data.id) {
          this.current = { id: data.id, price: +data.rate };
        }
      }
    });
    // 10秒ごとに最新価格をshortHistoryにため込む
    cron.schedule('*/10 * * * * *', () => {
      if (this.current) {
        const timespan = 10000;
        const timestamp = Math.round(Date.now() / timespan) * timespan;
        this.shortHistory.push({ timestamp, price: this.current.price });
      }
    });
    // 1時間ごとに、1時間以上前のshortHistoryをDBに保存してメモリから削除する。
    // 検証用に、3分ごととする。
    cron.schedule('0 */3 * * * *', async () => {
      const before1h = Date.now() - 3 * 60 * 1000;
      const saveData = this.shortHistory.filter((data: PriceHistory) => data.timestamp < before1h);
      console.log(`savebatch::${JSON.stringify({
        firstShortHistory: this.shortHistory[0],
        lastShortHistory: this.shortHistory[this.shortHistory.length - 1],
        now: Date.now(),
        before1h,
        saveData,
      })}`)
      if (saveData.length > 0) {
        const saveDataOrm = saveData.map((d) => new PriceHistoryOrm(d));
        await resetConnection();
        await getConnection().manager.save(saveDataOrm);
      }
      this.shortHistory = this.shortHistory.filter((data: PriceHistory) => data.timestamp >= before1h);
    });
  }

};
