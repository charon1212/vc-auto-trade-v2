import Graph from './Graph';
import MyTabContainer from './util/MyTabContainer';
import { useDateSelector } from './hooks/useDateSelector';
import { usePriceHistory } from './hooks/usePriceHistory';
import { useTradeResult } from './hooks/useTradeResult';
import ScoreBoard from './ScoreBoard';
import { useState } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';

const Main = () => {
  const { date, setDate, DateSelector } = useDateSelector();
  const { priceHistory } = usePriceHistory({ pair: 'btc_jpy', date: date || undefined });
  const { tradeResult } = useTradeResult({ date: date || undefined });

  const [filterMinutes, setFilterMinutes] = useState(true);

  return (
    <>
      <DateSelector />
      <MyTabContainer
        tabs={[
          {
            title: 'グラフ',
            contents: (
              <div style={{ margin: '20px' }}>
                <FormControlLabel
                  label='1分ごとで表示'
                  control={
                    <Checkbox
                      checked={filterMinutes}
                      onChange={(e) => {
                        setFilterMinutes(e.target.checked);
                      }}
                    />
                  }
                />
                <Graph
                  priceHistory={filterMinutes ? priceHistory.filter((v, i) => i % 6 === 0) : priceHistory}
                  tradeResult={tradeResult}
                  height={600}
                />
              </div>
            ),
          },
          {
            title: 'スコアボード',
            contents: (
              <div style={{ margin: '20px' }}>
                <ScoreBoard priceHistory={priceHistory} tradeResult={tradeResult} />
              </div>
            ),
          },
        ]}
      />
    </>
  );
};

export default Main;
