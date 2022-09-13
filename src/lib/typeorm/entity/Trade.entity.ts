import { Column, Entity, PrimaryColumn } from "typeorm";
import { DR } from "../../../common/typescript/deepreadonly";
import { Pair } from "../../../domain/Exchange/type";
import { Trade as DomainTrade, TradeParam, TradeStatus } from "../../../domain/Trade/Trade";

@Entity()
export class Trade {

  @PrimaryColumn()
  uid: string = '';
  @Column()
  strategyId: string = '';
  @Column()
  strategyBoxId: string = '';
  @Column()
  apiId: string = '';
  @Column({ type: "bigint" })
  orderAtMs: string = '0';
  @Column()
  pair: string = '';
  @Column()
  status: string = '';
  @Column({ type: "bigint" })
  lastUpdateStatusMs: string = '';
  @Column()
  side: string = '';
  @Column()
  amount: number = 0;
  @Column()
  type: string = '';
  @Column({ nullable: true, type: 'int' })
  rate: number | null = null;
  @Column()
  isForwardTest: boolean = false;

  constructor(trade?: DR<DomainTrade>) {
    if (trade) {
      this.uid = trade.uid;
      this.strategyId = trade.strategyId;
      this.strategyBoxId = trade.strategyBoxId;
      this.apiId = trade.apiId;
      this.orderAtMs = `${trade.orderAtMs}`;
      this.pair = trade.pair;
      this.status = trade.status;
      this.lastUpdateStatusMs = `${trade.lastUpdateStatusMs}`;
      this.side = trade.tradeParam.side;
      this.amount = trade.tradeParam.amount;
      this.type = trade.tradeParam.type;
      this.rate = trade.tradeParam.type === 'limit' ? trade.tradeParam.rate : null;
      this.isForwardTest = trade.isForwardTest;
    }
  }
  decode(): DomainTrade {
    return {
      uid: this.uid,
      strategyId: this.strategyId,
      strategyBoxId: this.strategyBoxId,
      apiId: this.apiId,
      orderAtMs: +this.orderAtMs,
      pair: this.pair as Pair,
      status: this.status as TradeStatus,
      lastUpdateStatusMs: +this.lastUpdateStatusMs,
      tradeParam: {
        side: this.side,
        amount: this.amount,
        type: this.type,
        rate: this.rate,
      } as TradeParam,
      executions: [],
      isForwardTest: this.isForwardTest,
    };

  }

}
