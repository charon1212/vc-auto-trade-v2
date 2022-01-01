import Graph from './Graph';
import MyTabContainer from './MyTabContainer';
import { useDateSelector } from './useDateSelector';
import { usePriceHistory } from './usePriceHistory';
import { useTradeResult } from './useTradeResult';

const Main = () => {
  const { date, setDate, DateSelector } = useDateSelector();
  const { priceHistory } = usePriceHistory({ pair: 'btc_jpy', date: date || undefined });
  const { tradeResult } = useTradeResult({ date: date || undefined });

  return (
    <>
      <DateSelector />
      <MyTabContainer
        tabs={[
          {
            title: 'グラフ',
            contents: (
              <div style={{ margin: '20px' }}>
                <Graph priceHistory={priceHistory.filter((v, i) => i % 6 === 0)} tradeResult={tradeResult} height={600} />
              </div>
            ),
          },
        ]}
      />
    </>
  );
};

export default Main;
