import { websocketTradeStart } from "../../interfaces/coincheck/wsTrade";
import { Pair } from "../../type/coincheck";
import * as cron from 'node-cron';
import { PriceHistory } from '../../typeorm/entity/PriceHistory'
import { connected, getConnection, resetConnection } from "../../typeorm/typeorm";
import { logger } from "../../common/log/logger";

export type PriceHistoryData = { timestamp: number, price: number };
/**
 * 市場の取引状況を監視し、過去の価格履歴や最新価格を提供する。
 * 2021/12/17追記：Websocketを使ってEC2に乗っけると、通信料が1日100GBのようなえぐいことになり、
 * 1日100円の課金がかかる事態になったので、10秒ごとにAPIをたたく方式に変更する。
 * Websocket盤はOldとしてここに残す。通信料問題がなければ使いたい。
 */
export class PriceManagerOld {

  // 最新価格
  public current: { id: number, price: number } | undefined;
  // 10秒ごとの価格リスト
  public shortHistory: PriceHistoryData[] = [];
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
    cron.schedule('0 0 * * * *', async () => {
      const before1h = Date.now() - 60 * 60 * 1000;
      const saveData = this.shortHistory.filter((data: PriceHistoryData) => data.timestamp < before1h);
      if (saveData.length > 0) {
        const saveDataEntity = saveData.map(({ timestamp, price }) => new PriceHistory({ timestamp: timestamp.toString(), price }));
        await getConnection().manager.save(saveDataEntity);
      }
      this.shortHistory = this.shortHistory.filter((data: PriceHistoryData) => data.timestamp >= before1h);
    });
  }

};
