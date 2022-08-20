import { Column, Entity, PrimaryColumn } from "typeorm";
import { DR } from "../../../common/typescript/deepreadonly";
import { Pair } from "../../../domain2/Exchange/type";
import { Trade as DomainTrade, TradeParam, TradeStatus } from "../../../domain2/Trade/Trade";

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
  @Column()
  rate: number | null = null;

  constructor(trade?: DR<DomainTrade>) {
    if (trade) {
      this.uid = trade.uid;
      this.strategyId = trade.strategyId;
      this.strategyBoxId = trade.strategyBoxId;
      this.apiId = trade.apiId;
      this.pair = trade.pair;
      this.status = trade.status;
      this.lastUpdateStatusMs = `${trade.lastUpdateStatusMs}`;
      this.side = trade.tradeParam.side;
      this.amount = trade.tradeParam.amount;
      this.type = trade.tradeParam.type;
      this.rate = trade.tradeParam.type === 'limit' ? trade.tradeParam.rate : null;
    }
  }
  decode(): DomainTrade {
    return {
      uid: this.uid,
      strategyId: this.strategyId,
      strategyBoxId: this.strategyBoxId,
      apiId: this.apiId,
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
    };

  }

}
