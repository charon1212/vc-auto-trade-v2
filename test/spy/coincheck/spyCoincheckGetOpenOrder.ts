import { Result } from '../../../src/common/error/Result';
import { CoincheckGetOpenOrder, ResponseBodyGetOpenOrder } from '../../../src/lib/coincheck/apiTool/CoincheckGetOpenOrder';

type OpenOrder = ResponseBodyGetOpenOrder['orders'][number];
const defaultOpenOrder: OpenOrder = {
  id: 0,
  order_type: 'buy',
  rate: null,
  pair: 'btc_jpy',
  pending_amount: null,
  pending_market_buy_amount: null,
  stop_loss_rate: null,
  created_at: '2022-01-02T03:04:05.678Z',
};

export const spyCoincheckGetOpenOrder = (mockSuccess: boolean, mockReturnOpenOrders: () => Partial<OpenOrder>[]) => {
  return jest.spyOn(CoincheckGetOpenOrder, 'request').mockImplementation(async () => {
    return Result.success({
      success: mockSuccess,
      orders: mockReturnOpenOrders().map((v) => ({ ...defaultOpenOrder, ...v })),
    });
  });
};
