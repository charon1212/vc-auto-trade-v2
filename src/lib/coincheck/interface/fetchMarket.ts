import { Vcat2ErrorCoincheckApi } from "../../../common/error/Vcat2Error";
import { logger } from "../../../common/log/logger";
import { Market, Pair } from "../../../domain/BaseType";
import { CoincheckGetTicker } from "../apiTool/CoincheckGetTicker";

export const fetchMarket = async (timestamp: number, pair: Pair) => {
  const result = await redo({
    func: () => CoincheckGetTicker.request({ pair }),
    accept: (result) => {
      if (!result.isOk) {
        const { er } = result;
        if (Vcat2ErrorCoincheckApi.is(er) && er.isEconresetError()) {// ECONRESET エラーの場合のみ受け入れない。
          logger.warn(`ECONRESET エラーのため再リクエスト`);
          return false;
        }
      }
      return true;
    },
    maxCount: 2,
    intervalMs: 100,
  });

  return result.handleOk((body) => {
    return { pair, timestamp, price: body.last } as Market;
  });
};

type RedoArg<T> = { func: () => Promise<T>, accept: (result: T) => boolean, maxCount: number, intervalMs?: number };
/**
 * 指定したメソッドを、戻り値がacceptされるまで繰り返す。
 *
 * @param args.func 実行するメソッド
 * @param args.accept 受け入れるレスポンスを判断する関数
 * @param args.maxCount 最大再実行回数
 * @param args.intervalMs 繰り返す間にsleepする場合、そのミリ秒
 * @returns args.funcの受け入れられた戻り値。ただし、最大再実行回数に達した場合、受け入れられない戻り値が帰る可能性もある。
 */
const redo = async <T>(args: RedoArg<T>): Promise<T> => {
  const { func, accept, maxCount, intervalMs } = args;
  let count = 1;
  while (true) {
    const result = await func();
    if (accept(result) || count === maxCount) return result;
    count++;
    if (intervalMs) await sleep(intervalMs);
  }
};

const sleep = (ms: number) => {
  return new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
};
