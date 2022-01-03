import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { calcScore } from '../logic/calcScore';
import { APriceHistory } from './hooks/usePriceHistory';
import { ATradeResult } from './hooks/useTradeResult';

type Props = {
  priceHistory: APriceHistory[];
  tradeResult: ATradeResult[];
};
const ScoreBoard = (props: Props) => {
  const { priceHistory, tradeResult } = props;
  const score = calcScore(tradeResult, priceHistory);
  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>戦略ID</TableCell>
            <TableCell>トレード回数</TableCell>
            <TableCell>損益</TableCell>
            <TableCell>実質損益</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {score.map((s) => (
            <TableRow>
              <TableCell>{s.strategyBoxId}</TableCell>
              <TableCell>{s.count}</TableCell>
              <TableCell>{s.benefit}</TableCell>
              <TableCell>{s.corBenefit}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default ScoreBoard;
