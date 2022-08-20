import { Pair } from "../Exchange/type";
import { Market, ShortHistory } from "./Market";
import * as cron from 'node-cron';
import { fetchMarket } from "../../lib/coincheck/interface/fetchMarket";
import { insertMarket } from "../../lib/typeorm/repository/Market/insertMarket";

export const marketInfoCacheSpanSecond = 10;
const spanMs = marketInfoCacheSpanSecond * 1000;

export const marketInfoCacheMap: { [pair in Pair]?: MarketInfoCache } = {};
export const addPairToMarketInfoCacheList = (pair: Pair) => {
  if (!marketInfoCacheMap[pair]) marketInfoCacheMap[pair] = new MarketInfoCache(pair);
};

class MarketInfoCache {

  public shortHistory: ShortHistory;
  public lackData: boolean[] = []; // 欠損データ判定
  constructor(private pair: Pair) {
    this.shortHistory = { pair, spanMs, priceHistory: [] };
  }
  getLastPrice() {
    const arr = this.shortHistory.priceHistory;
    if (arr.length === 0) return undefined;
    return arr[arr.length - 1];
  }
  schedule() {
    // 一定時間ごとに、最新の市場情報を取得する。
    cron.schedule(`*/${marketInfoCacheSpanSecond} * * * * *`, async () => {
      const timestamp = getTimestamp();
      const market = await fetchMarket(timestamp, this.pair);
      if (market) {
        this.shortHistory.priceHistory.push(market.price);
        this.lackData.push(false);
        await insertMarket(market);
      } else {
        const lastPrice = this.getLastPrice();
        if (lastPrice !== undefined) {
          this.shortHistory.priceHistory.push(lastPrice);
          this.lackData.push(true);
        }
      }
    });
    // 1時間ごとに、3時間以上前の履歴を削除する。
    cron.schedule('0 0 * * * *', async () => {
      const max = this.shortHistory.priceHistory.length - (3 * 60 * 60) / marketInfoCacheSpanSecond
      this.shortHistory.priceHistory = this.shortHistory.priceHistory.filter((_, i) => i < max);
      this.lackData = this.lackData.filter((_, i) => i < max);
    });
  }
}

const getTimestamp = () => Math.round(Date.now() / spanMs) * spanMs;

// TODO: implementation
const mockGetMarket = (timestamp: number, pair: Pair) => ({} as Market | undefined);
