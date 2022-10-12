import { Pair } from "../../../src/domain/BaseType";
import { spyCoincheckGetOpenOrder } from "../../spy/coincheck/spyCoincheckGetOpenOrder";
import { spyCoincheckGetTicker } from "../../spy/coincheck/spyCoincheckGetTicker";
import { spyCoincheckGetTransactions } from "../../spy/coincheck/spyCoincheckGetTransactions";
import { spyCoincheckPostOrder } from "../../spy/coincheck/spyCoincheckPostOrder";
import { RequestParamPostOrder } from '../../../src/lib/coincheck/apiTool/CoincheckPostOrder';
import { getLegalCurrency, getVirtualCurrency, LegalCurrency, VirtualCurrency } from "../../../src/domain/Exchange/currency";

type Order = {
  id: number,
  order_type: 'buy' | 'sell',
  type: 'limit' | 'market',
  rate: number | null,
  pair: Pair,
  pending_amount: number | null,
  pending_market_buy_amount: number | null,
  stop_loss_rate: number | null,
  created_at: string,
};
type FundLegal<P extends Pair> = { [key in LegalCurrency<P>]: string };
type FundVirtual<P extends Pair> = { [key in VirtualCurrency<P>]: string };
type Transaction<P extends Pair> = P extends any ? {
  id: number,
  order_id: number, // 注文のID
  created_at: string, // 取引時間
  funds: FundLegal<P> & FundVirtual<P>, // 各残高の増減
  pair: P, // 取引ペア
  rate: string, // 約定価格
  fee_currency: string, // 手数料の通貨
  fee: string, // 手数料
  liquidity: 'T' | 'M', // Taker/Maker
  side: 'buy' | 'sell', // 売り/買い
} : never;

const toStr = (a: number | null) => a === null ? null : `${a}`;
const createTransaction = <P extends Pair>({ id, pair, order, created_at, liquidity, price, }: { id: number, pair: P, order: Order, created_at: string, liquidity: 'T' | 'M', price: number, },): Transaction<P> => {
  const { id: order_id, order_type, type, pending_amount, pending_market_buy_amount, } = order;
  const amountVc = order_type === 'buy' && type === 'market' ? pending_market_buy_amount! / price : pending_amount!;
  const amountJp = amountVc * price;
  const transaction = {
    id, order_id, created_at, pair, liquidity, fee: '', fee_currency: '', side: order_type, rate: `${price}`,
    funds: { [getLegalCurrency(pair)]: amountJp, [getVirtualCurrency(pair)]: amountVc },
  } as Transaction<P>;
  return transaction;
};

export class DummyCoincheck {
  public now: number;
  public openOrderList: Order[] = [];
  public stopLossOrderList: Order[] = [];
  public transactionList: Transaction<Pair>[] = [];
  public postOrderCallHistory = [] as RequestParamPostOrder[];

  public spyCoincheckGetOpenOrder;
  public spyCoincheckGetTicker;
  public spyCoincheckGetTransactions;
  public spyCoincheckPostOrder;

  constructor(private price: (pair: Pair, time: number) => number, initialTime: number) {
    this.now = initialTime;
    this.spyCoincheckGetOpenOrder = spyCoincheckGetOpenOrder(true, () => this.openOrderList.map(
      ({ pending_amount, pending_market_buy_amount, stop_loss_rate, ...rest }) =>
      ({
        ...rest,
        pending_amount: toStr(pending_amount),
        pending_market_buy_amount: toStr(pending_market_buy_amount),
        stop_loss_rate: toStr(stop_loss_rate),
      })
    ));
    this.spyCoincheckGetTicker = spyCoincheckGetTicker((pair) => this.price(pair, this.now));
    this.spyCoincheckGetTransactions = spyCoincheckGetTransactions(true, () => this.transactionList.map(({ rate, ...rest }) => ({ ...rest, rate: `${rate}`, })));
    this.spyCoincheckPostOrder = spyCoincheckPostOrder((args) => {
      this.postOrderCallHistory.push(args);
      const { pair, side, type, amount, amountMarketBuy, rate, stopLossRate } = args;
      const p = this.price(pair, this.now);
      const created_at = (new Date(this.now)).toISOString();
      const order: Order = {
        pair, type, created_at, id: this.getId(), order_type: side,
        rate: rate ?? null,
        pending_amount: amount ?? null,
        pending_market_buy_amount: amountMarketBuy ?? null,
        stop_loss_rate: stopLossRate ?? null,
      };

      if (stopLossRate !== undefined) { // StopLossの場合
        this.stopLossOrderList.push(order);
      } else if (type === 'limit' && ((side === 'buy' && rate! < p) || (side === 'sell' && rate! > p))) { // Takerの場合 = 指値注文で即約定ではない場合。
        this.openOrderList.push(order);
      } else { // Makerの場合
        this.transactionList.push(createTransaction({ id: this.getId(), pair, created_at, liquidity: 'M', order, price: p }));
      }
      return order.id;
    });
  }

  spent(time: number) {
    while (this.now < time) this.next();
  }

  private next() {
    this.now += 1000;
    const created_at = (new Date(this.now)).toISOString();
    for (let order of [...this.stopLossOrderList]) {
      const price = this.price(order.pair, this.now);
      const stopLossRate = order.stop_loss_rate!;
      if ((order.order_type === 'buy' && price >= stopLossRate) || (order.order_type === 'sell' && price <= stopLossRate)) {
        if (order.type === 'limit' && ((order.order_type === 'buy' && order.rate! < price) || (order.order_type === 'sell' && order.rate! > price))) {
          this.openOrderList.push(order);
        } else {
          this.transactionList.push(createTransaction({ id: this.getId(), pair: order.pair, created_at, liquidity: 'M', order, price }));
        }
        this.stopLossOrderList = this.stopLossOrderList.filter((v) => v !== order);
      }
    }
    for (let order of [...this.openOrderList]) {
      const price = this.price(order.pair, this.now);
      if ((order.order_type === 'buy' && price <= order.rate!) || (order.order_type === 'sell' && price >= order.rate!)) {
        this.transactionList.push(createTransaction({ id: this.getId(), pair: order.pair, created_at, liquidity: 'T', order, price: order.rate! }));
        this.openOrderList = this.openOrderList.filter((v) => v !== order);
      }
    }
  }

  clearCallHistory() { this.postOrderCallHistory = []; };
  getPostOrderCallHistory() { return this.postOrderCallHistory; };

  // ID採番
  private idCount = 1;
  private getId() { return ++this.idCount; };
};
