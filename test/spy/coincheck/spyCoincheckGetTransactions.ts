import { CoincheckGetTransactions, ResponseBodyGetTransactions } from '../../../src/lib/coincheck/apiTool/CoincheckGetTransactions';

type Transaction = ResponseBodyGetTransactions['transactions'][number];
const defaultTransaction: Transaction = {
  id: 0,
  order_id: 0,
  created_at: '2022-01-02T03:04:05.678Z',
  funds: {
    btc: '0',
    jpy: '0',
  },
  pair: 'btc_jpy',
  rate: '0',
  fee_currency: '0',
  fee: '0',
  liquidity: 'T',
  side: 'buy',
};

export const spyCoincheckGetTransactions = (mockSuccess: boolean, mockReturnTransactions: () => Partial<Transaction>[]) => {
  return jest.spyOn(CoincheckGetTransactions, 'request').mockImplementation(async () => {
    return {
      success: mockSuccess,
      transactions: mockReturnTransactions().map((v) => ({ ...defaultTransaction, ...v, })),
    }
  });
};
