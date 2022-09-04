import { Column, Entity, PrimaryColumn } from "typeorm";
import { Pair } from "../../type/coincheck";

@Entity()
export class PriceHistory {

  @PrimaryColumn({ type: "bigint" })
  timestamp: string = '0';
  @PrimaryColumn()
  pair: Pair = 'btc_jpy';
  @Column()
  price: number = 0;

  constructor(param?: { timestamp?: string, price?: number, pair?: Pair }) {
    if (param?.timestamp !== undefined) this.timestamp = param.timestamp;
    if (param?.pair !== undefined) this.pair = param.pair;
    if (param?.price !== undefined) this.price = param.price;
  }

}
