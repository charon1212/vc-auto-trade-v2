import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class StrategyBox {

  @PrimaryColumn()
  id: string = '';
  @Column()
  strategyId: string = '';
  @Column()
  paramJson: string = '';
  @Column()
  contextJson: string = '';
  @Column()
  pair: string = '';
  @Column()
  delete: boolean = false;
  @Column()
  reflect: boolean = false;

  constructor() { }

}
