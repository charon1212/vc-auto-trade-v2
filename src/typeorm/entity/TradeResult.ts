import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TradeResult {

  @PrimaryGeneratedColumn('increment')
  id: number | undefined;
  @Column()
  type: 'buy' | 'sell';
  @Column()
  rate: number;
  @Column()
  amount: number;

  constructor(param: { type: 'buy' | 'sell', rate: number, amount: number, }) {
    this.type = param.type;
    this.rate = param.rate;
    this.amount = param.amount;
  }

}
