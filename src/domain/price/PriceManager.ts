import { Pair } from "../../type/coincheck";
import * as cron from 'node-cron';
import { PriceHistory } from '../../typeorm/entity/PriceHistory'
import { getConnection } from "../../typeorm/typeorm";
import { logger } from "../../common/log/logger";
import { apiTicker } from "../../interfaces/coincheck/apiTicker";

export type PriceHistoryData = { timestamp: number, price: number, lostData: boolean, };
/**
 * 市場の取引状況を監視し、過去の価格履歴や最新価格を提供する。
 */
export class PriceManager {

  // 10秒ごとの価格リスト
  public shortHistory: PriceHistoryData[] = [];
  /**
   * @param pair 取引ペア
   */
  constructor(protected pair: Pair) { }

  /**
   * 過去1時間のShortHistoryの中に、連続して2点の欠損データがある場合、無効データとしてfalseを返却する。
   */
  checkShortHistoryIsValid() {
    let lossCount = 0;
    for (let i = 0; i < Math.min(this.shortHistory.length, 360); i++) {
      if (this.shortHistory[i].lostData) lossCount++;
      else lossCount = 0;
      if (lossCount >= 2) return false;
    }
    return true;
  }

  /**
   * 市場の取引状況監視を始める。
   */
  start() {
    // 10秒ごとに最新価格をshortHistoryにため込む
    cron.schedule('*/10 * * * * *', async () => {
      const ticker = await apiTicker(this.pair);
      const timespan = 10000;
      const timestamp = Math.round(Date.now() / timespan) * timespan;
      if (ticker) {
        const price = ticker.last;
        this.shortHistory.push({ timestamp, price, lostData: false });
        await getConnection().manager.save(new PriceHistory({ timestamp: timestamp.toString(), price }));
      } else if (this.shortHistory.length > 0) { // 過去のデータがある場合、欠損データとして1個前のデータで登録
        this.shortHistory.push({ timestamp, price: this.shortHistory[this.shortHistory.length - 1].price, lostData: true });
      }
    });
    // 1時間ごとに、3時間以上前のshortHistoryを削除する。
    cron.schedule('0 0 * * * *', async () => {
      const before1h = Date.now() - 3 * 60 * 60 * 1000;
      this.shortHistory = this.shortHistory.filter((data: PriceHistoryData) => data.timestamp >= before1h);
    });
  }

};
