import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class PriceHistory {

  @PrimaryColumn()
  timestamp: number = 0;
  @Column({ type: "int", width: 200 })
  price: number = 0;

  constructor(param?: { timestamp?: number, price?: number }) {
    if (param?.timestamp !== undefined) this.timestamp = param.timestamp;
    if (param?.price !== undefined) this.price = param.price;
  }

}
