export type PenaltyColor = 'RED' | 'YELLOW'; // レッドカードとイエローカード。

/**
 * エラー発生のペナルティー。
 * エラーが発生した場合、それぞれをペナルティーとして記録する。
 */
export type Penalty = {
  strategyBoxId: string, // StrategyBoxに依存しないペナルティーは空文字。
  timestamp: number,
  reason: string,
  point: number,
  color: PenaltyColor,
};
