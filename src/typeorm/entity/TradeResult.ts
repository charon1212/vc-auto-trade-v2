import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TradeResult {

  @PrimaryGeneratedColumn('increment')
  id: number | undefined;
  @Column()
  type: 'market' | 'limit'; // 注文タイプ(market:成行, limit: 指値)
  @Column()
  side: 'buy' | 'sell'; // 注文サイド
  @Column()
  rate: number; // 価格レート(1仮想通貨が何円か)
  @Column()
  amount: number; // 注文量(単位は仮想通貨)
  @Column({ type: "bigint" })
  orderTimestamp: string; // 発注時刻

  constructor(param?: { type: 'market' | 'limit', side: 'buy' | 'sell', rate: number, amount: number, orderTimestamp: string, }) {
    this.type = param?.type || 'market';
    this.side = param?.side || 'buy';
    this.rate = param?.rate || 0;
    this.amount = param?.amount || 0;
    this.orderTimestamp = param?.orderTimestamp || '';
  }

}
