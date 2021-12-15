import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class PriceHistory {

  @PrimaryColumn({ type: "bigint" })
  timestamp: string = '0';
  @Column()
  price: number = 0;

  constructor(param?: { timestamp?: string, price?: number }) {
    if (param?.timestamp !== undefined) this.timestamp = param.timestamp;
    if (param?.price !== undefined) this.price = param.price;
  }

}
