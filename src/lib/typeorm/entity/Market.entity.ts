import { Column, Entity, PrimaryColumn } from "typeorm";
import { DR } from "../../../common/typescript/deepreadonly";
import { Market as DomainMarket, Pair } from "../../../domain/BaseType";

@Entity()
export class Market {

  @PrimaryColumn({ type: "bigint" })
  timestamp: string = '0';
  @PrimaryColumn()
  pair: string = '';
  @Column()
  price: number = 0;

  constructor(pair?: Pair, market?: DR<DomainMarket>) {
    if (pair && market) {
      this.timestamp = `${market.timestamp}`;
      this.pair = pair;
      this.price = market.price;
    }
  }

  decode(): DomainMarket {
    return {
      timestamp: +this.timestamp,
      price: this.price,
    };
  }

}
