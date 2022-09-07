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
