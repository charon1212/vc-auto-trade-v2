import { useEffect, useState } from 'react';
import startOfDay from 'date-fns/startOfDay';
import { getPriceHistory } from '../interfaces/getPriceHistory';

export const usePriceHistory = (params: { pair: 'btc_jpy'; date?: Date }) => {
  const { pair, date } = params;
  const [priceHistory, setPriceHistory] = useState<{ timestamp: number; price: number }[]>([]);
  useEffect(() => {
    if (date) {
      const startTimestamp = startOfDay(date).getTime();
      const lastTimestamp = startTimestamp + 24 * 60 * 60 * 1000;
      getPriceHistory({ pair, startTimestamp, lastTimestamp }).then((json) => {
        setPriceHistory(json.result.map(({ timestamp, price }) => ({ timestamp: +timestamp, price })));
      });
    }
  }, [pair, date]);

  return { priceHistory };
};
