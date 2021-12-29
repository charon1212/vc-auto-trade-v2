import { useMemo } from 'react';
import Chart from 'react-apexcharts';

type Props = {
  priceHistory: { timestamp: number; price: number }[];
  tradeResult: { timestamp: number; price: number; side: 'buy' | 'sell' }[];
};
const Graph = (props: Props) => {
  const { priceHistory, tradeResult } = props;
  const series = useMemo(() => {
    console.log('priceHistory', priceHistory);
    return priceHistory.map(({ timestamp, price }) => ({ x: timestamp, y: price }));
  }, [priceHistory]);
  const annotationPoints = useMemo(() => {
    return {
      buy: tradeResult.filter(({ side }) => side === 'buy').map(({ timestamp, price }) => ({ x: timestamp, y: price })),
      sell: tradeResult.filter(({ side }) => side === 'sell').map(({ timestamp, price }) => ({ x: timestamp, y: price })),
    };
  }, [tradeResult]);
  return (
    <>
      <Chart
        height={800}
        series={[{ data: series }]}
        options={{
          annotations: {
            points: [
              ...annotationPoints.buy.map(({ x, y }) => ({
                x,
                y,
                marker: { size: 4, fillColor: '#FF0000', strokeColor: '' },
                label: { text: 'buy' },
              })),
              ...annotationPoints.sell.map(({ x, y }) => ({
                x,
                y,
                marker: { size: 4, fillColor: '#0000FF', strokeColor: '' },
                label: { text: 'sell' },
              })),
            ],
          },
          stroke: { curve: 'smooth' },
          grid: { padding: { right: 30, left: 20 } },
          xaxis: { type: 'datetime' },
        }}
      />
    </>
  );
};

export default Graph;
