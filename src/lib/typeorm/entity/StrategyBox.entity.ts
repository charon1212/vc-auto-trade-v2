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
  isForwardTest: boolean = true;
  @Column()
  delete: boolean = false;

  constructor() { }

}
