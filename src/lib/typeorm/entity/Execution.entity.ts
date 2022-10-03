import { Column, Entity, PrimaryColumn } from "typeorm";
import { DR } from "../../../common/typescript/deepreadonly";
import { Execution as DomainExecution, Pair } from "../../../domain/BaseType";

@Entity()
export class Execution {

  @PrimaryColumn()
  uid: string = '';
  @Column()
  apiId: string = '';
  @Column()
  tradeUid: string = '';
  @Column()
  pair: string = '';
  @Column()
  rate: number = 0;
  @Column()
  amount: number = 0;
  @Column({ type: "bigint" })
  createdAtMs: string = '0';

  constructor(execution?: DR<DomainExecution>) {
    if (execution) {
      this.uid = execution.uid;
      this.apiId = execution.apiId;
      this.tradeUid = execution.tradeUid;
      this.pair = execution.pair;
      this.rate = execution.rate;
      this.amount = execution.amount;
      this.createdAtMs = `${execution.createdAtMs}`;
    }
  }
  decode(): DomainExecution {
    return {
      uid: this.uid,
      apiId: this.apiId,
      tradeUid: this.tradeUid,
      pair: this.pair as Pair,
      rate: this.rate,
      amount: this.amount,
      createdAtMs: +this.createdAtMs,
    };
  }

}
