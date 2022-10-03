import { Pair } from "../../src/domain/BaseType";
import { spyCoincheckGetOpenOrder } from "../spy/coincheck/spyCoincheckGetOpenOrder";
import { spyCoincheckGetTicker } from "../spy/coincheck/spyCoincheckGetTicker";
import { spyCoincheckGetTransactions } from "../spy/coincheck/spyCoincheckGetTransactions";
import { spyCoincheckPostOrder } from "../spy/coincheck/spyCoincheckPostOrder";
import { RequestParamPostOrder } from '../../src/lib/coincheck/apiTool/CoincheckPostOrder';

type Order = {
  id: number,
  order_type: 'buy' | 'sell',
  type: 'limit' | 'market',
  rate: number | null,
  pair: Pair,
  pending_amount: number | null,
  pending_market_buy_amount: number | null,
  stop_loss_rate: null,
  created_at: string,
};
type Transaction = {
  id: number,
  order_id: number, // 注文のID
  created_at: string, // 取引時間
  funds: { // 各残高の増減
    btc: number,
    jpy: number, // TODO: 貨幣はこれだけじゃない。ETCとかやる場合は追加が必要。
  },
  pair: Pair, // 取引ペア
  rate: number, // 約定価格
  fee_currency: '', // 手数料の通貨
  fee: '', // 手数料
  liquidity: 'T' | 'M', // Taker/Maker
  side: 'buy' | 'sell', // 売り/買い
};

const toStr = (a: number | null) => a === null ? null : `${a}`;

export class DummyCoincheck {
  public now: number;
  public openOrderList: Order[] = [];
  public transactionList: Transaction[] = [];
  public postOrderCallHistory = [] as RequestParamPostOrder[];

  public spyCoincheckGetOpenOrder;
  public spyCoincheckGetTicker;
  public spyCoincheckGetTransactions;
  public spyCoincheckPostOrder;

  constructor(private price: (pair: Pair, time: number) => number, initialTime: number) {
    this.now = initialTime;
    this.spyCoincheckGetOpenOrder = spyCoincheckGetOpenOrder(true, () => this.openOrderList.map(
      ({ id, order_type, created_at, pair, pending_amount, pending_market_buy_amount, rate, stop_loss_rate }) =>
      ({
        id, order_type, created_at, pair, rate, stop_loss_rate,
        pending_amount: toStr(pending_amount),
        pending_market_buy_amount: toStr(pending_market_buy_amount),
      })
    ));
    this.spyCoincheckGetTicker = spyCoincheckGetTicker((pair) => this.price(pair, this.now));
    this.spyCoincheckGetTransactions = spyCoincheckGetTransactions(true, () => this.transactionList.map(
      ({ id, order_id, created_at, funds: { btc, jpy }, pair, rate, fee_currency, fee, liquidity, side }) =>
        ({ id, order_id, created_at, pair, fee_currency, fee, liquidity, side, funds: { btc: `${btc}`, jpy: `${jpy}` }, rate: `${rate}`, })
    ));
    this.spyCoincheckPostOrder = spyCoincheckPostOrder((args) => {
      this.postOrderCallHistory.push(args);
      const { pair, side, type, amount, amountMarketBuy, rate } = args;
      const p = this.price(pair, this.now);
      const created_at = (new Date(this.now)).toISOString();
      const order_id = this.getId();
      // Takerの場合 = 指値注文で即約定ではない場合。
      if (type === 'limit' && ((side === 'buy' && rate! < p) || (side === 'sell' && rate! > p))) {
        this.openOrderList.push({
          id: order_id,
          order_type: side,
          type,
          rate: rate ?? null,
          pair,
          pending_amount: amount ?? null,
          pending_market_buy_amount: amountMarketBuy ?? null,
          stop_loss_rate: null,
          created_at,
        });
      } else { // Makerの場合、OpenOrderに登録せずに即約定する。
        const btc = side === 'buy' ? (amountMarketBuy || 0) / p : (amount || 0);
        const jpy = side === 'buy' ? (amountMarketBuy || 0) : (amount || 0) * p;
        this.transactionList.push({
          id: this.getId(),
          order_id,
          created_at,
          funds: { btc, jpy },
          pair,
          rate: p,
          fee_currency: '',
          fee: '',
          liquidity: 'M',
          side,
        });
      }
      return order_id;
    });
  }

  spent(time: number) {
    while (this.now < time) this.next();
  }

  private next() {
    this.now += 1000;
    const executedId = [] as number[];
    this.openOrderList.forEach(({ id, order_type, rate, pair, pending_amount }) => {
      const p = this.price(pair, this.now);
      if ((order_type === 'buy' && p <= rate!) || (order_type === 'sell' && p >= rate!)) {
        this.transactionList.push({
          id: this.getId(),
          order_id: id,
          created_at: (new Date(this.now)).toISOString(),
          funds: {
            btc: (pending_amount ?? 0) * (order_type === 'buy' ? 1 : -1),
            jpy: (pending_amount ?? 0) * (order_type === 'buy' ? -1 : 1),
          },
          pair,
          rate: p,
          fee_currency: '',
          fee: '',
          liquidity: 'M',
          side: order_type,
        });
        executedId.push(id);
      }
    });
    this.openOrderList = this.openOrderList.filter(({ id }) => !executedId.includes(id));
  }

  clearCallHistory() {
    this.postOrderCallHistory = [];
  }
  getPostOrderCallHistory() {
    return this.postOrderCallHistory;
  }

  // ID採番
  private idCount = 1;
  private getId() {
    this.idCount++;
    return this.idCount;
  }
};
