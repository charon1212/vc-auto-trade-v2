import { Column, Entity, PrimaryColumn } from "typeorm";
import { DR } from "../../../common/typescript/deepreadonly";
import { Pair } from "../../../domain/Exchange/type";
import { Market as DomainMarket } from '../../../domain/Market/Market'

@Entity()
export class Market {

  @PrimaryColumn({ type: "bigint" })
  timestamp: string = '0';
  @PrimaryColumn()
  pair: string = '';
  @Column()
  price: number = 0;

  constructor(market?: DR<DomainMarket>) {
    if (market) {
      this.timestamp = `${market.timestamp}`;
      this.pair = market.pair;
      this.price = market.price;
    }
  }

  decode(): DomainMarket {
    return {
      timestamp: +this.timestamp,
      pair: this.pair as Pair,
      price: this.price,
    };
  }

}
