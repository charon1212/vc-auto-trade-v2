import { useEffect, useState } from 'react';
import startOfDay from 'date-fns/startOfDay';
import { getTradeResult } from '../../interfaces/getTradeResult';

export type ATradeResult = { timestamp: number; price: number; side: 'buy' | 'sell'; strategyBoxId: string };

export const useTradeResult = (params: { date?: Date }) => {
  const { date } = params;
  const [tradeResult, setTradeResult] = useState<ATradeResult[]>([]);
  useEffect(() => {
    if (date) {
      const startTimestamp = startOfDay(date).getTime();
      const lastTimestamp = startTimestamp + 24 * 60 * 60 * 1000;
      getTradeResult({ startTimestamp, lastTimestamp }).then((json) => {
        setTradeResult(
          json.result.map(({ orderTimestamp, rate, side, strategyBoxId }) => ({ timestamp: +orderTimestamp, price: rate, side, strategyBoxId }))
        );
      });
    }
  }, [date]);

  return { tradeResult };
};
